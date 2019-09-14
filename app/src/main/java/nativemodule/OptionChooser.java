package nativemodule;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.Window;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import com.hack.stressbuster.R;

public class OptionChooser extends AppCompatActivity {

    String imageUrl;

    public static void openActivity(Context context, String imageUrl) {
        Intent intent = new Intent(context, OptionChooser.class);
        intent.putExtra("imageUrl",imageUrl);
        context.startActivity(intent);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        imageUrl= getIntent().getStringExtra("imageUrl");
        setContentView(R.layout.optionchooser);
        findViewById(R.id.image10).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                ReactDemoActivity.openActivity(OptionChooser.this, imageUrl,1);

            }
        });
        findViewById(R.id.image11).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                ReactDemoActivity.openActivity(OptionChooser.this, imageUrl,2);

            }
        });
        findViewById(R.id.image12).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                ReactDemoActivity.openActivity(OptionChooser.this, imageUrl,3);

            }
        });findViewById(R.id.image13).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                ReactDemoActivity.openActivity(OptionChooser.this, imageUrl,4);

            }
        });
    }
}
