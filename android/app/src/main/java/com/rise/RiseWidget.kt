package com.rise

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.view.View
import android.widget.RemoteViews
import com.rise.R
import org.json.JSONArray

class RiseWidget : AppWidgetProvider() {

    override fun onUpdate(context: Context, appWidgetManager: AppWidgetManager, appWidgetIds: IntArray) {
        for (appWidgetId in appWidgetIds) {
            val views = RemoteViews(context.packageName, R.layout.rise_widget)
            
            // Load data from SharedPreferences
            val sharedPref = context.getSharedPreferences("RiseWidgetPrefs", Context.MODE_PRIVATE)
            val dataString = sharedPref.getString("widgetData", "[]") ?: "[]"
            val dateLabel = sharedPref.getString("dateLabel", "TODAY") ?: "TODAY"
            val items = try { JSONArray(dataString) } catch (e: Exception) { JSONArray() }
            
            val textIds = intArrayOf(R.id.widget_row1_text, R.id.widget_row2_text, R.id.widget_row3_text)
            val itemCount = items.length()
            
            // Check if user is not logged in (special marker)
            val isNotLoggedIn = itemCount == 1 && 
                items.optJSONObject(0)?.optString("id") == "__not_logged_in__"
            
            if (isNotLoggedIn) {
                // Hide all task rows
                for (textId in textIds) {
                    views.setViewVisibility(textId, View.GONE)
                }
                views.setViewVisibility(R.id.widget_empty, View.GONE)
                
                // Hide + button when not logged in
                views.setViewVisibility(R.id.widget_add, View.GONE)
                
                // Show login button
                views.setViewVisibility(R.id.widget_login_btn, View.VISIBLE)
                
                // Set date label to just "RISE"
                views.setTextViewText(R.id.widget_date_label, "RISE")
                
                // Login button click
                val loginIntent = Intent(context, MainActivity::class.java).apply {
                    addCategory(Intent.CATEGORY_LAUNCHER)
                    flags = Intent.FLAG_ACTIVITY_NEW_TASK
                }
                val loginPendingIntent = PendingIntent.getActivity(
                    context, 5, loginIntent,
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                        PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                    } else {
                        PendingIntent.FLAG_UPDATE_CURRENT
                    }
                )
                views.setOnClickPendingIntent(R.id.widget_login_btn, loginPendingIntent)
            } else {
                // Hide login button when logged in
                views.setViewVisibility(R.id.widget_login_btn, View.GONE)
                
                // Show + button
                views.setViewVisibility(R.id.widget_add, View.VISIBLE)
                
                // Set date label
                views.setTextViewText(R.id.widget_date_label, "$dateLabel ▼")
                
                // Populate rows with tasks
                for (i in 0 until 3) {
                    if (i < itemCount) {
                        val item = items.getJSONObject(i)
                        val title = item.optString("title", "Task")
                        val status = item.optString("status", "pending")
                        
                        val displayText = if (status.equals("completed", ignoreCase = true)) {
                            "✓ $title"
                        } else {
                            "○ $title"
                        }
                        
                        views.setTextViewText(textIds[i], displayText)
                        views.setViewVisibility(textIds[i], View.VISIBLE)
                    } else {
                        views.setViewVisibility(textIds[i], View.GONE)
                    }
                }
                
                // Show/hide empty view
                views.setViewVisibility(R.id.widget_empty, if (itemCount == 0) View.VISIBLE else View.GONE)
            }
            
            // Logo click - opens main app
            val logoIntent = Intent(context, MainActivity::class.java).apply {
                addCategory(Intent.CATEGORY_LAUNCHER)
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
            }
            val logoPendingIntent = PendingIntent.getActivity(
                context, 0, logoIntent,
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                } else {
                    PendingIntent.FLAG_UPDATE_CURRENT
                }
            )
            views.setOnClickPendingIntent(R.id.widget_logo, logoPendingIntent)

            // Date label click - cycles through dates
            val dateLabelIntent = Intent(Intent.ACTION_VIEW, Uri.parse("rise://widget-date")).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
            }
            val dateLabelPendingIntent = PendingIntent.getActivity(
                context, 3, dateLabelIntent,
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                } else {
                    PendingIntent.FLAG_UPDATE_CURRENT
                }
            )
            views.setOnClickPendingIntent(R.id.widget_date_label, dateLabelPendingIntent)

            // Add button click - opens add modal
            val addIntent = Intent(Intent.ACTION_VIEW, Uri.parse("rise://add")).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
            }
            val addPendingIntent = PendingIntent.getActivity(
                context, 1, addIntent,
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                } else {
                    PendingIntent.FLAG_UPDATE_CURRENT
                }
            )
            views.setOnClickPendingIntent(R.id.widget_add, addPendingIntent)

            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
    }
}
