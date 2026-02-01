package com.rise

import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import android.util.Log
import com.rise.R

class WidgetBridge(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "WidgetBridge"
    }

    @ReactMethod
    fun setWidgetData(data: String) {
        try {
            Log.d("WidgetBridge", "Setting widget data: $data")
            val sharedPref = reactApplicationContext.getSharedPreferences("RiseWidgetPrefs", Context.MODE_PRIVATE)
            with(sharedPref.edit()) {
                putString("widgetData", data)
                apply()
            }

            val context = reactApplicationContext
            val appWidgetManager = AppWidgetManager.getInstance(context)
            val componentName = ComponentName(context, RiseWidget::class.java)
            val ids = appWidgetManager.getAppWidgetIds(componentName)

            if (ids.isNotEmpty()) {
                Log.d("WidgetBridge", "Notifying ${ids.size} widgets")
                
                // Update the collection
                // appWidgetManager.notifyAppWidgetViewDataChanged(ids, R.id.widget_list)
                
                // Trigger a general update
                val updateIntent = Intent(context, RiseWidget::class.java).apply {
                    action = AppWidgetManager.ACTION_APPWIDGET_UPDATE
                    putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, ids)
                }
                context.sendBroadcast(updateIntent)
            } else {
                Log.d("WidgetBridge", "No widgets found to update")
            }
        } catch (e: Exception) {
            Log.e("WidgetBridge", "Error updating widget data", e)
        }
    }
}
