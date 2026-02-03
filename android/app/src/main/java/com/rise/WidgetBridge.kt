package com.rise

import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import android.util.Log

class WidgetBridge(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "WidgetBridge"
    }

    @ReactMethod
    fun setWidgetData(data: String) {
        try {
            Log.d("WidgetBridge", "Setting widget data: ${data.take(200)}...")
            val sharedPref = reactApplicationContext.getSharedPreferences("RiseWidgetPrefs", Context.MODE_PRIVATE)
            with(sharedPref.edit()) {
                putString("widgetData", data)
                apply()
            }

            notifyWidgetUpdate()
        } catch (e: Exception) {
            Log.e("WidgetBridge", "Error updating widget data", e)
        }
    }

    @ReactMethod
    fun setWidgetLabels(labels: String) {
        try {
            Log.d("WidgetBridge", "Setting widget labels: $labels")
            val sharedPref = reactApplicationContext.getSharedPreferences("RiseWidgetPrefs", Context.MODE_PRIVATE)
            with(sharedPref.edit()) {
                putString("widgetLabels", labels)
                apply()
            }
        } catch (e: Exception) {
            Log.e("WidgetBridge", "Error updating widget labels", e)
        }
    }

    @ReactMethod
    fun setWidgetLabel(labelName: String) {
        try {
            Log.d("WidgetBridge", "Setting selected label: $labelName")
            val sharedPref = reactApplicationContext.getSharedPreferences("RiseWidgetPrefs", Context.MODE_PRIVATE)
            with(sharedPref.edit()) {
                putString("selectedLabel", labelName)
                apply()
            }

            notifyWidgetUpdate()
        } catch (e: Exception) {
            Log.e("WidgetBridge", "Error updating widget label", e)
        }
    }

    private fun notifyWidgetUpdate() {
        val context = reactApplicationContext
        val appWidgetManager = AppWidgetManager.getInstance(context)
        val componentName = ComponentName(context, RiseWidget::class.java)
        val ids = appWidgetManager.getAppWidgetIds(componentName)

        if (ids.isNotEmpty()) {
            Log.d("WidgetBridge", "Notifying ${ids.size} widgets")
            
            // Notify that data changed for ListView
            appWidgetManager.notifyAppWidgetViewDataChanged(ids, R.id.widget_list)
            
            // Also send custom broadcast to update widget UI
            val updateIntent = Intent("com.rise.WIDGET_UPDATE")
            context.sendBroadcast(updateIntent)
        } else {
            Log.d("WidgetBridge", "No widgets found to update")
        }
    }
}
