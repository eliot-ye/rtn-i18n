package com.rtni18n;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.Map;

public class LangCodeModule extends ReactContextBaseJavaModule {
    private final LangCodeModuleImpl implementation;

    LangCodeModule(ReactApplicationContext reactContext) {
        super(reactContext);
        implementation = new LangCodeModuleImpl(reactContext);
    }

    @Override
    @NonNull
    public String getName() {
        return LangCodeModuleImpl.NAME;
    }

    @Override
    public Map<String, Object> getConstants() {
        return implementation.getConstants();
    }

    @ReactMethod
    public void setLangCode(String langCode){
        implementation.setLangCode(langCode);
    }
}
