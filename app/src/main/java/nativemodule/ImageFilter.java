package nativemodule;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.ColorMatrix;
import android.graphics.ColorMatrixColorFilter;
import android.graphics.Paint;
import android.net.Uri;
import android.os.Build;
import android.util.Log;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.URISyntaxException;

import cn.Ragnarok.BitmapFilter;
import cn.Ragnarok.SketchFilter;

public class ImageFilter {
    public static final double sigma = 8.0;

    public static Bitmap getFilteredBitmap(Bitmap bitmap) {
        Bitmap resizedBitmap = getResizedBitmap(bitmap, 100, 100);
        return resizedBitmap;

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
    public static Bitmap reduceBitmapSize(Uri imageUri)
    {
        File imageFilePath = new File(imageUri.getPath());


        BitmapFactory.Options bmOptions = new BitmapFactory.Options();
        bmOptions.inJustDecodeBounds = true;
        BitmapFactory.decodeFile(imageFilePath.getAbsolutePath(), bmOptions);
        bmOptions.inSampleSize = 4;
        bmOptions.inJustDecodeBounds = false;
        Bitmap bitmap =BitmapFactory.decodeFile(imageFilePath.getAbsolutePath(),bmOptions);
        return bitmap;
    }
    }
