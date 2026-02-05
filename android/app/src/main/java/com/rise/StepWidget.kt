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

class StepWidget : AppWidgetProvider() {
    override fun onUpdate(context: Context, appWidgetManager: AppWidgetManager, appWidgetIds: IntArray) {
        for (appWidgetId in appWidgetIds) {
            updateWidget(context, appWidgetManager, appWidgetId)
        }
    }

    override fun onReceive(context: Context, intent: Intent) {
        super.onReceive(context, intent)
        if (intent.action == "com.rise.WIDGET_UPDATE") {
            val appWidgetManager = AppWidgetManager.getInstance(context)
            val appWidgetIds = appWidgetManager.getAppWidgetIds(android.content.ComponentName(context, StepWidget::class.java))
            onUpdate(context, appWidgetManager, appWidgetIds)
        }
    }

    companion object {
        fun updateWidget(context: Context, appWidgetManager: AppWidgetManager, appWidgetId: Int) {
            val views = RemoteViews(context.packageName, R.layout.widget_habit_sensor)
            // Icon removed from layout by user
            
            // Shared Prefs data
            val sharedPref = context.getSharedPreferences("RiseWidgetPrefs", Context.MODE_PRIVATE)
            val sensorDataStr = sharedPref.getString("sensorData", "{}") ?: "{}"
            
            try {
                val sensorData = JSONObject(sensorDataStr)
                val stepData = sensorData.optJSONObject("pedometer")
                
                if (stepData != null && stepData.optBoolean("exists", true)) {
                    val progress = stepData.optDouble("progress", 0.0)
                    val goal = stepData.optDouble("goal", 10000.0)
                    val isCompleted = stepData.optBoolean("isCompleted", false)
                    val habitId = stepData.optString("id", "")

                    views.setViewVisibility(R.id.habit_content, View.VISIBLE)
                    views.setViewVisibility(R.id.habit_empty_btn, View.GONE)
                    
                    views.setTextViewText(R.id.habit_title, "STEP LEGEND")
                    views.setTextViewText(R.id.sensor_value, progress.toInt().toString())
                    views.setTextViewText(R.id.sensor_unit, "STEPS")
                    views.setTextViewText(R.id.habit_goal_text, "GOAL: ${goal.toInt()}")
                    
                    views.setProgressBar(R.id.habit_progress, goal.toInt(), progress.toInt(), false)
                    
                    // Click intent - open habit detail
                    val intent = Intent(context, MainActivity::class.java).apply {
                        action = Intent.ACTION_VIEW
                        data = Uri.parse("rise://item/$habitId/habit")
                        flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
                    }
                    val pendingIntent = PendingIntent.getActivity(context, 100, intent, 
                        PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)
                    views.setOnClickPendingIntent(R.id.habit_content, pendingIntent)
                    
                } else {
                    // Habit doesn't exist - show ADD state
                    views.setViewVisibility(R.id.habit_content, View.GONE)
                    views.setViewVisibility(R.id.habit_empty_btn, View.VISIBLE)
                    views.setTextViewText(R.id.habit_empty_btn, "ADD STEPS HABIT")
                    
                    val intent = Intent(context, MainActivity::class.java).apply {
                        action = Intent.ACTION_VIEW
                        data = Uri.parse("rise://add-sensor-habit/step_legend")
                        flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
                    }
                    val pendingIntent = PendingIntent.getActivity(context, 101, intent, 
                        PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)
                    views.setOnClickPendingIntent(R.id.habit_empty_btn, pendingIntent)
                }
            } catch (e: Exception) {
                Log.e("StepWidget", "Error updating widget", e)
            }

            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
    }
}
