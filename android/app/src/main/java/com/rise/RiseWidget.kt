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

        // Handle data refresh broadcast
        if (intent.action == "com.rise.WIDGET_UPDATE") {
            Log.d("RiseWidget", "Received WIDGET_UPDATE broadcast")
            val appWidgetManager = AppWidgetManager.getInstance(context)
            val componentName = ComponentName(context, RiseWidget::class.java)
            val appWidgetIds = appWidgetManager.getAppWidgetIds(componentName)

            // Notify that data changed
            appWidgetManager.notifyAppWidgetViewDataChanged(appWidgetIds, R.id.widget_list)

            // Also update the widget views
            onUpdate(context, appWidgetManager, appWidgetIds)
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

            // Load data from SharedPreferences
            val sharedPref = context.getSharedPreferences("RiseWidgetPrefs", Context.MODE_PRIVATE)
            val dataString = sharedPref.getString("widgetData", "[]") ?: "[]"
            val selectedLabel = sharedPref.getString("selectedLabel", "All") ?: "All"
            val items =
                    try {
                        JSONArray(dataString)
                    } catch (e: Exception) {
                        JSONArray()
                    }

            val itemCount = items.length()
            Log.d("RiseWidget", "Data count: $itemCount, Selected label: $selectedLabel")

            // Check if user is not logged in
            val isNotLoggedIn =
                    itemCount == 1 && items.optJSONObject(0)?.optString("id") == "__not_logged_in__"

            if (isNotLoggedIn) {
                // Hide list and show login
                views.setViewVisibility(R.id.widget_list, View.GONE)
                views.setViewVisibility(R.id.widget_empty, View.GONE)
                views.setViewVisibility(R.id.widget_add, View.GONE)
                views.setViewVisibility(R.id.widget_login_btn, View.VISIBLE)
                views.setTextViewText(R.id.widget_date_label, "RISE")

                // Login button click - EXPLICIT intent with component
                val loginIntent =
                        Intent(context, MainActivity::class.java).apply {
                            action = Intent.ACTION_MAIN
                            addCategory(Intent.CATEGORY_LAUNCHER)
                            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
                        }
                val loginPendingIntent =
                        PendingIntent.getActivity(
                                context,
                                5,
                                loginIntent,
                                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                        )
                views.setOnClickPendingIntent(R.id.widget_login_btn, loginPendingIntent)
            } else {
                // Show list and hide login
                views.setViewVisibility(R.id.widget_login_btn, View.GONE)
                views.setViewVisibility(R.id.widget_add, View.VISIBLE)
                views.setViewVisibility(R.id.widget_list, View.VISIBLE)

                // Show current label in header
                views.setTextViewText(R.id.widget_date_label, "$selectedLabel ▼")

                // Setup ListView with RemoteViewsService
                val serviceIntent =
                        Intent(context, RiseWidgetService::class.java).apply {
                            putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetId)
                            // Unique URI to prevent view reuse issues
                            data = Uri.parse(toUri(Intent.URI_INTENT_SCHEME))
                        }
                views.setRemoteAdapter(R.id.widget_list, serviceIntent)
                views.setEmptyView(R.id.widget_list, R.id.widget_empty)

                // Template for item clicks - EXPLICIT intent targeting MainActivity
                val clickIntent =
                        Intent(context, MainActivity::class.java).apply {
                            action = Intent.ACTION_VIEW
                            // The fill-in intent from RiseWidgetService will add the data URI
                        }
                val clickPendingIntent =
                        PendingIntent.getActivity(
                                context,
                                2,
                                clickIntent,
                                PendingIntent.FLAG_MUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
                        )
                views.setPendingIntentTemplate(R.id.widget_list, clickPendingIntent)
            }

            // Logo click - opens main app (EXPLICIT intent)
            val logoIntent =
                    Intent(context, MainActivity::class.java).apply {
                        action = Intent.ACTION_MAIN
                        addCategory(Intent.CATEGORY_LAUNCHER)
                        flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
                    }
            val logoPendingIntent =
                    PendingIntent.getActivity(
                            context,
                            0,
                            logoIntent,
                            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                    )
            views.setOnClickPendingIntent(R.id.widget_logo, logoPendingIntent)

            // Label selector click - opens label picker modal in app (EXPLICIT intent)
            val labelIntent =
                    Intent(context, MainActivity::class.java).apply {
                        action = Intent.ACTION_VIEW
                        data = Uri.parse("rise://label-picker")
                        flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_SINGLE_TOP
                    }
            val labelPendingIntent =
                    PendingIntent.getActivity(
                            context,
                            3,
                            labelIntent,
                            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                    )
            views.setOnClickPendingIntent(R.id.widget_date_label, labelPendingIntent)

            // Add button click - opens add task modal in app (EXPLICIT intent)
            val addIntent =
                    Intent(context, MainActivity::class.java).apply {
                        action = Intent.ACTION_VIEW
                        data = Uri.parse("rise://add")
                        flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_SINGLE_TOP
                    }
            val addPendingIntent =
                    PendingIntent.getActivity(
                            context,
                            1,
                            addIntent,
                            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                    )
            views.setOnClickPendingIntent(R.id.widget_add, addPendingIntent)

            appWidgetManager.updateAppWidget(appWidgetId, views)
            Log.d("RiseWidget", "Widget updated successfully")
        }
    }
}
