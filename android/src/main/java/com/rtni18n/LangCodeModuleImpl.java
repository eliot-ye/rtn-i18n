package com.rtni18n;

import android.content.Context;
import android.content.SharedPreferences;
import android.content.res.Configuration;
import android.content.res.Resources;

import com.facebook.react.bridge.ReactApplicationContext;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

public class LangCodeModuleImpl {

    public static final String NAME = "LangCode";

    public static final String LANG_CODE_KEY = "langCode";

    ReactApplicationContext ctx;

    LangCodeModuleImpl(ReactApplicationContext reactContext){
        ctx = reactContext;

        String langCodeOverride = getPreferences().getString(LANG_CODE_KEY, null);
        if(langCodeOverride != null){
            setLang(langCodeOverride);
        }
    }

    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put("langCode", getCurrentLanguage());
        return constants;
    }

    private void setLang(String langCode){
        Resources resources = ctx.getResources();
        Configuration config = resources.getConfiguration();
        String[] langCodeList = langCode.split("-");
        if(langCodeList.length == 1){
            config.locale = new Locale(langCode);
        }else{
            config.locale = new Locale(langCodeList[0], langCodeList[1]);
        }
        resources.updateConfiguration(config, null);
    }
    public void setLangCode(String langCode){
        setLang(langCode);
        SharedPreferences.Editor editor = getPreferences().edit();
        editor.putString(LANG_CODE_KEY, langCode);
        editor.apply();
    }

    public String getCurrentLanguage(){
        Locale locale = ctx.getResources().getConfiguration().locale;
        String langCode = locale.getLanguage();
        String countryCode = locale.getCountry();

        return langCode+"-"+countryCode;
    }

    public SharedPreferences getPreferences(){
        return ctx.getSharedPreferences("RNLocaleCode", Context.MODE_PRIVATE);
    }

}