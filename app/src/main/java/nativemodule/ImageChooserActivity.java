package nativemodule;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import com.contoso.demoapp.MainActivity;
import com.contoso.demoapp.R;
import com.contoso.demoapp.ReactDemoActivity;

public class ImageChooserActivity extends AppCompatActivity {

    public static void openActivity(Context context) {
        Intent intent=new Intent(context, ImageChooserActivity.class);
        context.startActivity(intent);
    }
    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.image_chooser);
        findViewById(R.id.submit).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                ReactDemoActivity.openActivity(ImageChooserActivity.this);

            }
        });
    }
}
