package com.rise

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.view.View
import android.widget.RemoteViews
import org.json.JSONObject
import android.util.Log

class SilenceWidget : AppWidgetProvider() {
    override fun onUpdate(context: Context, appWidgetManager: AppWidgetManager, appWidgetIds: IntArray) {
        for (appWidgetId in appWidgetIds) {
            updateWidget(context, appWidgetManager, appWidgetId)
        }
    }

    override fun onReceive(context: Context, intent: Intent) {
        super.onReceive(context, intent)
        if (intent.action == "com.rise.WIDGET_UPDATE") {
            val appWidgetManager = AppWidgetManager.getInstance(context)
            val appWidgetIds = appWidgetManager.getAppWidgetIds(android.content.ComponentName(context, SilenceWidget::class.java))
            onUpdate(context, appWidgetManager, appWidgetIds)
        }
    }

    companion object {
        fun updateWidget(context: Context, appWidgetManager: AppWidgetManager, appWidgetId: Int) {
            val views = RemoteViews(context.packageName, R.layout.widget_habit_sensor)
            // Icon removed from layout by user
            val sharedPref = context.getSharedPreferences("RiseWidgetPrefs", Context.MODE_PRIVATE)
            val sensorDataStr = sharedPref.getString("sensorData", "{}") ?: "{}"
            
            try {
                val sensorData = JSONObject(sensorDataStr)
                val habitData = sensorData.optJSONObject("noise")
                
                if (habitData != null && habitData.optBoolean("exists", true)) {
                    val progressSec = habitData.optDouble("progress", 0.0)
                    val goalSec = habitData.optDouble("goal", 3600.0)
                    val habitId = habitData.optString("id", "")

                    views.setViewVisibility(R.id.habit_content, View.VISIBLE)
                    views.setViewVisibility(R.id.habit_empty_btn, View.GONE)
                    
                    views.setTextViewText(R.id.habit_title, "DEEP SILENCE")
                    
                    // Format time: MM:SS or HH:MM
                    val mins = (progressSec / 60).toInt()
                    views.setTextViewText(R.id.sensor_value, mins.toString())
                    views.setTextViewText(R.id.sensor_unit, "MINUTES")
                    
                    views.setTextViewText(R.id.habit_goal_text, "GOAL: ${(goalSec/60).toInt()}M")
                    views.setProgressBar(R.id.habit_progress, goalSec.toInt(), progressSec.toInt(), false)
                    
                    val intent = Intent(context, MainActivity::class.java).apply {
                        action = Intent.ACTION_VIEW
                        data = Uri.parse("rise://item/$habitId/habit")
                        flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
                    }
                    views.setOnClickPendingIntent(R.id.habit_content, PendingIntent.getActivity(context, 300, intent, 
                        PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE))
                } else {
                    views.setViewVisibility(R.id.habit_content, View.GONE)
                    views.setViewVisibility(R.id.habit_empty_btn, View.VISIBLE)
                    views.setTextViewText(R.id.habit_empty_btn, "ADD SILENCE HABIT")
                    
                    val intent = Intent(context, MainActivity::class.java).apply {
                        action = Intent.ACTION_VIEW
                        data = Uri.parse("rise://add-sensor-habit/deep_silence")
                        flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
                    }
                    views.setOnClickPendingIntent(R.id.habit_empty_btn, PendingIntent.getActivity(context, 301, intent, 
                        PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE))
                }
            } catch (e: Exception) { Log.e("SilenceWidget", "Error", e) }
            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
    }
}
