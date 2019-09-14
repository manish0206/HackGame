package nativemodule;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.drawable.BitmapDrawable;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.MediaStore;
import android.provider.Settings;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.res.ResourcesCompat;

import com.contoso.reactnativedemolibrary.ReactNativeDemoLibrary;
import com.facebook.soloader.SoLoader;
import com.hack.stressbuster.R;
import com.makeramen.roundedimageview.RoundedImageView;

import java.io.File;

import cn.Ragnarok.BitmapFilter;

public class CartoonImageActivity extends AppCompatActivity {
    String imageUrl;
    RoundedImageView roundedImageView;
    public static void openActivity(Context context, String finalPath) {
        Intent intent = new Intent(context, CartoonImageActivity.class);
        intent.putExtra("imageUri",finalPath);
        context.startActivity(intent);
    }


    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.cartoon_activity);
        imageUrl=getIntent().getStringExtra("imageUri");
        findViewById(R.id.submit).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                OptionChooser.openActivity(CartoonImageActivity.this,imageUrl);

            }
        });
        Log.d(this.getClass().getName(),""+imageUrl);
        roundedImageView=findViewById(R.id.cartoonimg);
        File imgFile = new  File(imageUrl);
        if(imgFile.exists()) {
            Bitmap myBitmap = BitmapFactory.decodeFile(imgFile.getAbsolutePath());
            roundedImageView.setImageBitmap(myBitmap);
        }

    }


    /**
     * Activity hosting React Native demo.
     */

}
