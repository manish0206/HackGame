package nativemodule;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.Window;

import androidx.appcompat.app.AppCompatActivity;

import com.contoso.reactnativedemolibrary.ReactNativeDemoLibrary;
import com.facebook.soloader.SoLoader;

public class ReactDemoActivity extends AppCompatActivity {

    private static final int OVERLAY_PERMISSION_REQ_CODE = 9000;
    private String imageUrl;
    private int value;

    public static void openActivity(Context context, String imageUrl, int value) {
        Intent intent = new Intent(context, ReactDemoActivity.class);
        intent.putExtra("imageUrl", imageUrl);
        intent.putExtra("value", value);
        context.startActivity(intent);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        imageUrl = getIntent().getStringExtra("imageUrl");
        value = getIntent().getIntExtra("value", 5);

        try {
            SoLoader.init(getApplication(), 0);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        openReactView();

    }

    @SuppressLint("NewApi")
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == OVERLAY_PERMISSION_REQ_CODE) {

            openReactView();
        }
    }

    private void openReactView() {
        View view = ReactNativeDemoLibrary.createHelloWorldView(this, true, imageUrl,value);
        setContentView(view);
    }
}