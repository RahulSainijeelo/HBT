package com.rise

import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap

class WidgetBridge(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "WidgetBridge"
    }

    @ReactMethod
    fun setWidgetData(data: String) {
        val sharedPref = reactApplicationContext.getSharedPreferences("RiseWidgetPrefs", Context.MODE_PRIVATE)
        with(sharedPref.edit()) {
            putString("widgetData", data)
            apply()
        }

        // Notify the widget that data has changed
        val context = reactApplicationContext
        val intent = Intent(context, RiseWidget::class.java)
        intent.action = AppWidgetManager.ACTION_APPWIDGET_UPDATE
        
        val appWidgetManager = AppWidgetManager.getInstance(context)
        val ids = appWidgetManager.getAppWidgetIds(ComponentName(context, RiseWidget::class.java))
        
        intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, ids)
        context.sendBroadcast(intent)
        
        // Specifically notify the collection view (if we use one)
        appWidgetManager.notifyAppWidgetViewDataChanged(ids, R.id.widget_list)
    }
}
