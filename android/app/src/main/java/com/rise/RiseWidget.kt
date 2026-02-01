package com.rise

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.widget.RemoteViews

class RiseWidget : AppWidgetProvider() {

    override fun onUpdate(context: Context, appWidgetManager: AppWidgetManager, appWidgetIds: IntArray) {
        for (appWidgetId in appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId)
        }
    }

    private fun updateAppWidget(context: Context, appWidgetManager: AppWidgetManager, appWidgetId: Int) {
        val views = RemoteViews(context.packageName, R.layout.rise_widget)
        
        // 1. Setup the RemoteViewsService for the ListView
        val intent = Intent(context, RiseWidgetService::class.java).apply {
            putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetId)
            data = Uri.parse(toUri(Intent.URI_INTENT_SCHEME))
        }
        views.setRemoteAdapter(R.id.widget_list, intent)
        views.setEmptyView(R.id.widget_list, R.id.widget_empty)

        // 2. Setup "Add" button click (opens add modal)
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

        // 3. Setup item template click (ListView children)
        // This will be combined with the fillInIntent from the factory
        val clickIntent = Intent(Intent.ACTION_VIEW).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK
        }
        val clickPendingIntent = PendingIntent.getActivity(
            context, 2, clickIntent,
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                PendingIntent.FLAG_MUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
            } else {
                PendingIntent.FLAG_UPDATE_CURRENT
            }
        )
        views.setPendingIntentTemplate(R.id.widget_list, clickPendingIntent)

        // 4. Logo click opens the app
        val logoIntent = Intent(context, MainActivity::class.java).apply {
            action = Intent.ACTION_MAIN
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

        appWidgetManager.updateAppWidget(appWidgetId, views)
    }
}
