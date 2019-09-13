package nativemodule;

import android.Manifest;
import android.content.Context;
import android.content.ContextWrapper;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.media.MediaScannerConnection;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Log;
import android.view.View;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import com.hack.stressbuster.R;
import com.makeramen.roundedimageview.RoundedImageView;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Calendar;

import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;

public class ImageChooserActivity extends AppCompatActivity {
    private static final String IMAGE_DIRECTORY = "/stressbuster";
    private int GALLERY = 1, CAMERA = 2;
    private String finalPath = "";
    RoundedImageView imageView;
    private static final int MY_CAMERA_REQUEST_CODE = 100;
    private static final  int MY_GALLERY_REQUEST=1100;


    public static void openActivity(Context context) {
        Intent intent = new Intent(context, ImageChooserActivity.class);
        context.startActivity(intent);
    }

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.image_chooser);
        imageView=findViewById(R.id.imageView);
        findViewById(R.id.submit).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                openActivity();
            }
        });
        findViewById(R.id.camera).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                takePhotoFromCamera();
            }
        });
        findViewById(R.id.gallery).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                choosePhotoFromGallary();
            }
        });
    }


    private void choosePhotoFromGallary() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (checkSelfPermission(Manifest.permission.READ_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED||checkSelfPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
                requestPermissions(new String[]{Manifest.permission.READ_EXTERNAL_STORAGE,Manifest.permission.WRITE_EXTERNAL_STORAGE}, MY_GALLERY_REQUEST);
            }else{
                Intent galleryIntent = new Intent(Intent.ACTION_PICK,
                        MediaStore.Images.Media.INTERNAL_CONTENT_URI);
                startActivityForResult(galleryIntent, GALLERY);
            }
        }else {
            Intent galleryIntent = new Intent(Intent.ACTION_PICK,
                    MediaStore.Images.Media.INTERNAL_CONTENT_URI);
            startActivityForResult(galleryIntent, GALLERY);
        }
    }


    private void takePhotoFromCamera() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (checkSelfPermission(Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED||checkSelfPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
                requestPermissions(new String[]{Manifest.permission.CAMERA,Manifest.permission.WRITE_EXTERNAL_STORAGE}, MY_CAMERA_REQUEST_CODE);
            }else{
                Intent intent = new Intent(android.provider.MediaStore.ACTION_IMAGE_CAPTURE);
                startActivityForResult(intent, CAMERA);
            }
        }else {
            Intent intent = new Intent(android.provider.MediaStore.ACTION_IMAGE_CAPTURE);
            startActivityForResult(intent, CAMERA);
        }
    }
    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == MY_CAMERA_REQUEST_CODE) {
            if (grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                Toast.makeText(this, "camera permission granted", Toast.LENGTH_LONG).show();
                takePhotoFromCamera();
            } else {
                Toast.makeText(this, "camera permission denied", Toast.LENGTH_LONG).show();
            }
        }
        if(requestCode == MY_GALLERY_REQUEST){
            if (grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                Toast.makeText(this, "Gallery permission granted", Toast.LENGTH_LONG).show();
                choosePhotoFromGallary();
            } else {
                Toast.makeText(this, "Gallery permission denied", Toast.LENGTH_LONG).show();
            }
        }
    }
    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {

        super.onActivityResult(requestCode, resultCode, data);
        if (resultCode == this.RESULT_CANCELED) {
            return;
        }

        if (requestCode == GALLERY) {
            if (data != null) {
                try {
                    Bitmap bitmap = manageImageFromUri(data.getData());
                    if (bitmap != null) {
                        imageView.setImageBitmap(bitmap);
                        Bitmap filteredBitmap = ImageFilter.getFilteredBitmap(bitmap);
                        finalPath = saveToExternalStorage(filteredBitmap,"SB_"+Calendar.getInstance().getTimeInMillis());
                        Toast.makeText(ImageChooserActivity.this, "Image Saved!", Toast.LENGTH_SHORT).show();
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                    Toast.makeText(ImageChooserActivity.this, "Failed!", Toast.LENGTH_SHORT).show();
                }
            }

        } else if (requestCode == CAMERA) {
            Bitmap thumbnail = (Bitmap) data.getExtras().get("data");

            if (thumbnail != null) {
                imageView.setImageBitmap(thumbnail);
                Bitmap filteredBitmap = ImageFilter.getFilteredBitmap(thumbnail);
                finalPath = saveToExternalStorage(filteredBitmap,"SB_"+Calendar.getInstance().getTimeInMillis());
                Toast.makeText(ImageChooserActivity.this, "Image Saved!", Toast.LENGTH_SHORT).show();
            }
        }
    }

    private void openActivity() {
        CartoonImageActivity.openActivity(this, finalPath);
    }


    private void uploadToServer(String filePath) {
        Retrofit retrofit = NetworkClient.getRetrofitClient(this);
        UploadFileApiService uploadAPIs = retrofit.create(UploadFileApiService.class);
        //Create a file object using file path
        // Create a request body with file and image media type
        File file = new File(filePath);
        RequestBody requestFile = RequestBody.create(MediaType.parse("multipart/form-data"), file);
        MultipartBody.Part body =
                MultipartBody.Part.createFormData("imageForPost", file.getName(), requestFile);
        // Create MultipartBody.Part using file request-body,file name and part name

        //Create request body with text description and text media type
        RequestBody description = RequestBody.create(MediaType.parse("text/plain"), "image-type");
        //
        Call call = uploadAPIs.uploadImage(body);
        call.enqueue(new Callback() {
            @Override
            public void onResponse(Call call, Response response) {

            }
            @Override
            public void onFailure(Call call, Throwable t) {
            }
        });
    }

    private String saveToInternalStorage(Bitmap bitmapImage){
        ContextWrapper cw = new ContextWrapper(getApplicationContext());
        // path to /data/data/yourapp/app_data/imageDir
        File directory = cw.getDir("imageDir", Context.MODE_PRIVATE);
        // Create imageDir
        File mypath=new File(directory,"profile.jpg");

        FileOutputStream fos = null;
        try {
            fos = new FileOutputStream(mypath);
            // Use the compress method on the BitMap object to write image to the OutputStream
            bitmapImage.compress(Bitmap.CompressFormat.PNG, 100, fos);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                fos.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return directory.getAbsolutePath();
    }

    private Bitmap manageImageFromUri(Uri imageUri) {
        Bitmap bitmap = null;

        try {
            bitmap = MediaStore.Images.Media.getBitmap(
                    this.getContentResolver(), imageUri);

        } catch (Exception e) {
            // Manage exception ...
        }

        return bitmap;

    }
    public static String saveToExternalStorage(Bitmap bitmap, String fileName) {
        File directory = new File(Environment.getExternalStorageDirectory().getAbsolutePath() + "/StressBuster/");

        // Create imageDir
        if (!directory.exists()) {
            directory.mkdir();
        }
        File mypath = new File(directory, fileName);
        FileOutputStream fos = null;
        try {

            fos = new FileOutputStream(mypath);
            // Use the compress method on the BitMap object to write image to the OutputStream
            bitmap.compress(Bitmap.CompressFormat.PNG, 100, fos);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if (fos != null) {
                    fos.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return mypath.getAbsolutePath();
    }
}
