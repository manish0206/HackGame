package nativemodule;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import com.contoso.demoapp.R;
import com.contoso.demoapp.ReactDemoActivity;

public class SelectWeapon extends AppCompatActivity {
    public static void openActivity(Context context) {
        Intent intent=new Intent(context, SelectWeapon.class);
        context.startActivity(intent);
    }


    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main1);
        setContentView(R.layout.activity_main3);
        findViewById(R.id.submit).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                SplashScreen.openActivity(SelectWeapon.this);
                //finish();
            }
        });
    }
}

