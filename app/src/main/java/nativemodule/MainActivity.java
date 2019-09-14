package nativemodule;

import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.drawable.BitmapDrawable;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.MediaStore;
import android.provider.Settings;
import android.view.View;
import android.widget.ImageView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.res.ResourcesCompat;

import com.hack.stressbuster.R;


public class MainActivity extends AppCompatActivity {
        private static final int OVERLAY_PERMISSION_REQ_CODE = 1212;
        double sigma=16.0;

        ImageView imageView;
        @Override
        protected void onCreate(Bundle savedInstanceState) {
            super.onCreate(savedInstanceState);
            setContentView(R.layout.activity_main);
            imageView=findViewById(R.id.imageView);
            Bitmap myLogo = ((BitmapDrawable) ResourcesCompat.getDrawable(getResources(), R.drawable.ic_launcher, null)).getBitmap();

            imageView.setImageBitmap(myLogo);
    //        updateView(myLogo);
            imageView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    pickImageFromGallery();
                }
            });
            findViewById(R.id.btn).setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
//                    ReactDemoActivity.openActivity(MainActivity.this,null);
                }
            });

        }

        private void pickImageFromGallery() {
            Intent galleryIntent = new Intent(Intent.ACTION_PICK,
                    MediaStore.Images.Media.INTERNAL_CONTENT_URI);
            startActivityForResult(galleryIntent, 101);
        }
        @Override
        protected final void onActivityResult(final int requestCode,
                                              final int resultCode, final Intent i) {
            super.onActivityResult(requestCode, resultCode, i);
            if (requestCode == OVERLAY_PERMISSION_REQ_CODE) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    if (!Settings.canDrawOverlays(this)) {
                        Toast.makeText(this, "You cannot open the React Native app as you have denied the permission", Toast.LENGTH_SHORT).show();
                    }else{

                    }
                }
            }
            if (resultCode == RESULT_OK) {
                switch (requestCode) {
                    case 101:
                        manageImageFromUri(i.getData());
                        break;
                }
            } else {
                // manage result not ok !
            }

        }
        private void manageImageFromUri(Uri imageUri) {
            Bitmap bitmap = null;

            try {
                bitmap = MediaStore.Images.Media.getBitmap(
                        this.getContentResolver(), imageUri);

            } catch (Exception e) {
                // Manage exception ...
            }

            if (bitmap != null) {
                imageView.setImageBitmap(bitmap);
            }
        }
    }
