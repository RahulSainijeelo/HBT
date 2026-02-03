package com.rise

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.util.Log
import android.view.View
import android.widget.RemoteViews
import org.json.JSONArray

class RiseWidget : AppWidgetProvider() {

        override fun onUpdate(
                context: Context,
                appWidgetManager: AppWidgetManager,
                appWidgetIds: IntArray
        ) {
                Log.d("RiseWidget", "onUpdate called with ${appWidgetIds.size} widgets")

                for (appWidgetId in appWidgetIds) {
                        updateAppWidget(context, appWidgetManager, appWidgetId)
                }
        }

        override fun onReceive(context: Context, intent: Intent) {
                super.onReceive(context, intent)

                when (intent.action) {
                        "com.rise.WIDGET_UPDATE" -> {
                                Log.d("RiseWidget", "Received WIDGET_UPDATE broadcast")
                                val appWidgetManager = AppWidgetManager.getInstance(context)
                                val componentName = ComponentName(context, RiseWidget::class.java)
                                val appWidgetIds = appWidgetManager.getAppWidgetIds(componentName)

                                appWidgetManager.notifyAppWidgetViewDataChanged(
                                        appWidgetIds,
                                        R.id.widget_list
                                )
                                onUpdate(context, appWidgetManager, appWidgetIds)
                        }
                        "com.rise.TOGGLE_TASK" -> {
                                val itemId = intent.getStringExtra("itemId") ?: return
                                val itemType = intent.getStringExtra("itemType") ?: "task"
                                Log.d("RiseWidget", "Toggle action: $itemId, type: $itemType")

                                // Toggle the task in SharedPreferences
                                toggleItemInPrefs(context, itemId, itemType)

                                // Refresh widget
                                val appWidgetManager = AppWidgetManager.getInstance(context)
                                val componentName = ComponentName(context, RiseWidget::class.java)
                                val appWidgetIds = appWidgetManager.getAppWidgetIds(componentName)
                                appWidgetManager.notifyAppWidgetViewDataChanged(
                                        appWidgetIds,
                                        R.id.widget_list
                                )
                        }
                }
        }

        private fun toggleItemInPrefs(context: Context, itemId: String, itemType: String) {
                try {
                        val sharedPref =
                                context.getSharedPreferences(
                                        "RiseWidgetPrefs",
                                        Context.MODE_PRIVATE
                                )
                        val dataString = sharedPref.getString("widgetData", "[]") ?: "[]"
                        val items = JSONArray(dataString)

                        for (i in 0 until items.length()) {
                                val item = items.getJSONObject(i)
                                if (item.optString("id") == itemId) {
                                        val currentStatus = item.optString("status", "pending")
                                        val newStatus =
                                                if (currentStatus == "completed") "pending"
                                                else "completed"
                                        item.put("status", newStatus)
                                        break
                                }
                        }

                        with(sharedPref.edit()) {
                                putString("widgetData", items.toString())
                                apply()
                        }
                        Log.d("RiseWidget", "Toggled item $itemId")
                } catch (e: Exception) {
                        Log.e("RiseWidget", "Error toggling item", e)
                }
        }

        companion object {
                fun updateAppWidget(
                        context: Context,
                        appWidgetManager: AppWidgetManager,
                        appWidgetId: Int
                ) {
                        Log.d("RiseWidget", "updateAppWidget for $appWidgetId")

                        val views = RemoteViews(context.packageName, R.layout.rise_widget)

                        val sharedPref =
                                context.getSharedPreferences(
                                        "RiseWidgetPrefs",
                                        Context.MODE_PRIVATE
                                )
                        val dataString = sharedPref.getString("widgetData", "[]") ?: "[]"
                        val selectedLabel = sharedPref.getString("selectedLabel", "All") ?: "All"
                        val items =
                                try {
                                        JSONArray(dataString)
                                } catch (e: Exception) {
                                        JSONArray()
                                }

                        val itemCount = items.length()
                        Log.d(
                                "RiseWidget",
                                "Data count: $itemCount, Selected label: $selectedLabel"
                        )

                        val isNotLoggedIn =
                                itemCount == 1 &&
                                        items.optJSONObject(0)?.optString("id") ==
                                                "__not_logged_in__"

                        if (isNotLoggedIn) {
                                views.setViewVisibility(R.id.widget_list, View.GONE)
                                views.setViewVisibility(R.id.widget_empty, View.GONE)
                                views.setViewVisibility(R.id.widget_add, View.GONE)
                                views.setViewVisibility(R.id.widget_login_btn, View.VISIBLE)
                                views.setTextViewText(R.id.widget_date_label, "RISE")

                                val loginIntent =
                                        Intent(context, MainActivity::class.java).apply {
                                                action = Intent.ACTION_MAIN
                                                addCategory(Intent.CATEGORY_LAUNCHER)
                                                flags =
                                                        Intent.FLAG_ACTIVITY_NEW_TASK or
                                                                Intent.FLAG_ACTIVITY_CLEAR_TOP
                                        }
                                val loginPendingIntent =
                                        PendingIntent.getActivity(
                                                context,
                                                5,
                                                loginIntent,
                                                PendingIntent.FLAG_UPDATE_CURRENT or
                                                        PendingIntent.FLAG_IMMUTABLE
                                        )
                                views.setOnClickPendingIntent(
                                        R.id.widget_login_btn,
                                        loginPendingIntent
                                )
                        } else {
                                views.setViewVisibility(R.id.widget_login_btn, View.GONE)
                                views.setViewVisibility(R.id.widget_add, View.VISIBLE)
                                views.setViewVisibility(R.id.widget_list, View.VISIBLE)

                                // Show current label (no arrow text, just the label name)
                                views.setTextViewText(R.id.widget_date_label, selectedLabel)

                                val serviceIntent =
                                        Intent(context, RiseWidgetService::class.java).apply {
                                                putExtra(
                                                        AppWidgetManager.EXTRA_APPWIDGET_ID,
                                                        appWidgetId
                                                )
                                                data = Uri.parse(toUri(Intent.URI_INTENT_SCHEME))
                                        }
                                views.setRemoteAdapter(R.id.widget_list, serviceIntent)
                                views.setEmptyView(R.id.widget_list, R.id.widget_empty)

                                // Template for item clicks - broadcast for direct toggle
                                val toggleIntent =
                                        Intent(context, RiseWidget::class.java).apply {
                                                action = "com.rise.TOGGLE_TASK"
                                        }
                                val togglePendingIntent =
                                        PendingIntent.getBroadcast(
                                                context,
                                                2,
                                                toggleIntent,
                                                PendingIntent.FLAG_MUTABLE or
                                                        PendingIntent.FLAG_UPDATE_CURRENT
                                        )
                                views.setPendingIntentTemplate(
                                        R.id.widget_list,
                                        togglePendingIntent
                                )
                        }

                        // Logo click - opens main app
                        val logoIntent =
                                Intent(context, MainActivity::class.java).apply {
                                        action = Intent.ACTION_MAIN
                                        addCategory(Intent.CATEGORY_LAUNCHER)
                                        flags =
                                                Intent.FLAG_ACTIVITY_NEW_TASK or
                                                        Intent.FLAG_ACTIVITY_CLEAR_TOP
                                }
                        val logoPendingIntent =
                                PendingIntent.getActivity(
                                        context,
                                        0,
                                        logoIntent,
                                        PendingIntent.FLAG_UPDATE_CURRENT or
                                                PendingIntent.FLAG_IMMUTABLE
                                )
                        views.setOnClickPendingIntent(R.id.widget_logo, logoPendingIntent)

                        // Label container click - opens label picker as transparent modal
                        val labelIntent =
                                Intent(context, MainActivity::class.java).apply {
                                        action = Intent.ACTION_VIEW
                                        data = Uri.parse("rise://label-picker")
                                        flags =
                                                Intent.FLAG_ACTIVITY_NEW_TASK or
                                                        Intent.FLAG_ACTIVITY_SINGLE_TOP
                                }
                        val labelPendingIntent =
                                PendingIntent.getActivity(
                                        context,
                                        3,
                                        labelIntent,
                                        PendingIntent.FLAG_UPDATE_CURRENT or
                                                PendingIntent.FLAG_IMMUTABLE
                                )
                        views.setOnClickPendingIntent(
                                R.id.widget_label_container,
                                labelPendingIntent
                        )

                        // Add button click - opens add modal as transparent activity
                        val addIntent =
                                Intent(context, MainActivity::class.java).apply {
                                        action = Intent.ACTION_VIEW
                                        data = Uri.parse("rise://add")
                                        flags =
                                                Intent.FLAG_ACTIVITY_NEW_TASK or
                                                        Intent.FLAG_ACTIVITY_SINGLE_TOP
                                }
                        val addPendingIntent =
                                PendingIntent.getActivity(
                                        context,
                                        1,
                                        addIntent,
                                        PendingIntent.FLAG_UPDATE_CURRENT or
                                                PendingIntent.FLAG_IMMUTABLE
                                )
                        views.setOnClickPendingIntent(R.id.widget_add, addPendingIntent)

                        appWidgetManager.updateAppWidget(appWidgetId, views)
                        Log.d("RiseWidget", "Widget updated successfully")
                }
        }
}
