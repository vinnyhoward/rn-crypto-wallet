package com.didcomm;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

public class DidcommModule extends ReactContextBaseJavaModule {
    static {
        System.loadLibrary("didcomm_sdk");
    }

    private static native String hello_world();
    private static native void free_string(String ptr);

    public DidcommModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "Didcomm";
    }

    @ReactMethod
    public void helloWorld(Promise promise) {
        try {
            String result = hello_world();
            promise.resolve(result);
        } catch (Exception e) {
            promise.reject("ERROR", e.getMessage());
        }
    }
}