package nativemodule;

import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.ColorMatrix;
import android.graphics.ColorMatrixColorFilter;
import android.graphics.Matrix;
import android.graphics.Paint;

import cn.Ragnarok.BitmapFilter;

public class ImageFilter  {

    public static Bitmap getFilteredBitmap(Bitmap bitmap){

        Bitmap resizedBitmap=getResizedBitmap(bitmap,100,100);
       return BitmapFilter.changeStyle(resizedBitmap, BitmapFilter.NEON_STYLE, 50);



    }
    public static Bitmap getResizedBitmap(Bitmap bitmap, int newWidth, int newHeight) {
        int width = bitmap.getWidth();
        int height = bitmap.getHeight();

        Bitmap mutableBitmap = bitmap.copy(Bitmap.Config.ARGB_8888, true);
        Canvas canvas = new Canvas(mutableBitmap);
        Paint paint = new Paint();
        paint.setAntiAlias(true);

        float scaleValue = 95 * 1.0F / 127;

        ColorMatrix scaleMatrix = new ColorMatrix();
        scaleMatrix.reset();
        scaleMatrix.setScale((float) (scaleValue + 0.2), (float) (scaleValue + 0.4), (float) (scaleValue + 0.2), 1);

        ColorMatrix satMatrix = new ColorMatrix();
        satMatrix.reset();
        satMatrix.setSaturation(0.85f);

        ColorMatrix allMatrix = new ColorMatrix();
        allMatrix.reset();
        allMatrix.postConcat(scaleMatrix);
        allMatrix.postConcat(satMatrix);

        paint.setColorFilter(new ColorMatrixColorFilter(allMatrix));
        canvas.drawBitmap(bitmap, 0, 0, paint);

        int[] pixels = new int[width * height];
        mutableBitmap.getPixels(pixels, 0, width, 0, 0, width, height);
        return mutableBitmap;
    }
}
