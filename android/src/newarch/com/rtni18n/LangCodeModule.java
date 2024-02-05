package com.rtni18n;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;

import java.util.Map;

public class LangCodeModule extends NativeLangCodeSpec {
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
    protected Map<String, Object> getTypedExportedConstants() {
        return implementation.getConstants();
    }

    @Override
    public void setLangCode(String langCode) {
        implementation.setLangCode(langCode);
    }
}
