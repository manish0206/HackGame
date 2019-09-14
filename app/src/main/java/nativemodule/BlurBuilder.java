package nativemodule;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.os.Build;
import android.renderscript.Allocation;
import android.renderscript.Element;
import android.renderscript.RenderScript;
import android.renderscript.ScriptIntrinsicBlur;

import androidx.annotation.RequiresApi;

import java.nio.IntBuffer;

import cn.Ragnarok.BitmapFilter;

public class BlurBuilder {
    private static final float BITMAP_SCALE = 10f;
    private static final float BLUR_RADIUS = 0.04f;

    public static Bitmap blur(Context context, Bitmap image) {
        int width = Math.round(image.getWidth() * BITMAP_SCALE);
        int height = Math.round(image.getHeight() * BITMAP_SCALE);

        Bitmap inputBitmap = Bitmap.createScaledBitmap(image, width, height, false);
        Bitmap outputBitmap = Bitmap.createBitmap(inputBitmap);
        RenderScript rs = RenderScript.create(context);
        ScriptIntrinsicBlur theIntrinsic = ScriptIntrinsicBlur.create(rs, Element.U8_4(rs));
        Allocation tmpIn = Allocation.createFromBitmap(rs, inputBitmap);
        Allocation tmpOut = Allocation.createFromBitmap(rs, outputBitmap);
        theIntrinsic.setRadius(BLUR_RADIUS);
        theIntrinsic.setInput(tmpIn);
        theIntrinsic.forEach(tmpOut);
        tmpOut.copyTo(outputBitmap);

        return Sketch.changeToSketch(image);
    }
//    public Bitmap getCartoonizedBitmap(Bitmap realBitmap, Bitmap dodgeBlendBitmap, int hueIntervalSize, int saturationIntervalSize, int valueIntervalSize, int saturationPercent, int valuePercent) {
//        // Bitmap bitmap = Bitmap.createBitmap(scaledBitmap);
//        // //fastblur(scaledBitmap, 4);
//        Bitmap base = fastblur(realBitmap, 3).copy(Bitmap.Config.ARGB_8888, true);
//        Bitmap dodge = dodgeBlendBitmap.copy(Bitmap.Config.ARGB_8888, false);
//        try {
//            int realColor;
//            int color;
//            float top = VALUE_TOP; //Between 0.0f .. 1.0f I use 0.87f
//            IntBuffer templatePixels = IntBuffer.allocate(dodge.getWidth()
//                    * dodge.getHeight());
//            IntBuffer scaledPixels = IntBuffer.allocate(base.getWidth()
//                    * base.getHeight());
//            IntBuffer buffOut = IntBuffer.allocate(base.getWidth()
//                    * base.getHeight());
//
//            base.copyPixelsToBuffer(scaledPixels);
//            dodge.copyPixelsToBuffer(templatePixels);
//
//            templatePixels.rewind();
//            scaledPixels.rewind();
//            buffOut.rewind();
//
//            while (buffOut.position() < buffOut.limit()) {
//                color = (templatePixels.get());
//                realColor = scaledPixels.get();
//
//                float[] realHSV = new float[3];
//                Color.colorToHSV(realColor, realHSV);
//
//                realHSV[0] = getRoundedValue(realHSV[0], hueIntervalSize);
//
//                realHSV[2] = (getRoundedValue(realHSV[2] * 100,
//                        valueIntervalSize) / 100) * (valuePercent / 100);
//                realHSV[2] = realHSV[2]<1.0?realHSV[2]:1.0f;
//
//                realHSV[1] = realHSV[1] * (saturationPercent / 100);
//                realHSV[1] = realHSV[1]<1.0?realHSV[1]:1.0f;
//
//                float[] HSV = new float[3];
//                Color.colorToHSV(color, HSV);
//
//                boolean putBlackPixel = HSV[2] <= top;
//
//                realColor = Color.HSVToColor(realHSV);
//
//                if (putBlackPixel) {
//                    buffOut.put(color);
//                } else {
//                    buffOut.put(realColor);
//                }
//            }// END WHILE
//            dodge.recycle();
//            buffOut.rewind();
//            base.copyPixelsFromBuffer(buffOut);
//
//        } catch (Exception e) {
//            // TODO: handle exception
//        }
//
//        return base;
//    }

    public static float getRoundedValue(float value, int intervalSize) {
        float result = Math.round(value);
        int mod = ((int) result) % intervalSize;
        result += mod < (intervalSize / 2) ? -mod : intervalSize - mod;
        return result;

    }

    public static Bitmap ColorDodgeBlend(Bitmap source, Bitmap layer) {
        Bitmap base = source.copy(Bitmap.Config.ARGB_8888, true);
        Bitmap blend = layer.copy(Bitmap.Config.ARGB_8888, false);

        IntBuffer buffBase = IntBuffer.allocate(base.getWidth() * base.getHeight());
        base.copyPixelsToBuffer(buffBase);
        buffBase.rewind();

        IntBuffer buffBlend = IntBuffer.allocate(blend.getWidth() * blend.getHeight());
        blend.copyPixelsToBuffer(buffBlend);
        buffBlend.rewind();

        IntBuffer buffOut = IntBuffer.allocate(base.getWidth() * base.getHeight());
        buffOut.rewind();

        while (buffOut.position() < buffOut.limit()) {
            int filterInt = buffBlend.get();
            int srcInt = buffBase.get();

            int redValueFilter = Color.red(filterInt);
            int greenValueFilter = Color.green(filterInt);
            int blueValueFilter = Color.blue(filterInt);

            int redValueSrc = Color.red(srcInt);
            int greenValueSrc = Color.green(srcInt);
            int blueValueSrc = Color.blue(srcInt);

            int redValueFinal = colordodge(redValueFilter, redValueSrc);
            int greenValueFinal = colordodge(greenValueFilter, greenValueSrc);
            int blueValueFinal = colordodge(blueValueFilter, blueValueSrc);

            int pixel = Color.argb(255, redValueFinal, greenValueFinal, blueValueFinal);

            buffOut.put(pixel);
        }

        buffOut.rewind();

        base.copyPixelsFromBuffer(buffOut);
        blend.recycle();

        return base;
    }
    private static int colordodge(int in1, int in2) {
        float image = (float)in2;
        float mask = (float)in1;
        return ((int) ((image == 255) ? image:Math.min(255, (((long)mask << 8 ) / (255 - image)))));

    }
}