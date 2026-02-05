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
    fun setSensorData(data: String) {
        try {
            Log.d("WidgetBridge", "Setting sensor data: $data")
            val sharedPref = reactApplicationContext.getSharedPreferences("RiseWidgetPrefs", Context.MODE_PRIVATE)
            with(sharedPref.edit()) {
                putString("sensorData", data)
                apply()
            }
            // Notify all widgets that sensor data changed
            notifyWidgetUpdate()
        } catch (e: Exception) {
            Log.e("WidgetBridge", "Error updating sensor data", e)
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
        
        // Notify main list widget
        val mainIds = appWidgetManager.getAppWidgetIds(ComponentName(context, RiseWidget::class.java))
        if (mainIds.isNotEmpty()) {
            appWidgetManager.notifyAppWidgetViewDataChanged(mainIds, R.id.widget_list)
        }

        // Send broad broadcast to all widget providers
        val updateIntent = Intent("com.rise.WIDGET_UPDATE").apply {
            setPackage(context.packageName)
        }
        context.sendBroadcast(updateIntent)
        
        Log.d("WidgetBridge", "Sent WIDGET_UPDATE broadcast")
    }
}
