package com.rise

import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.widget.RemoteViews
import com.rise.R

class RiseWidget : AppWidgetProvider() {

    override fun onUpdate(context: Context, appWidgetManager: AppWidgetManager, appWidgetIds: IntArray) {
        for (appWidgetId in appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId)
        }
    }

    private fun updateAppWidget(context: Context, appWidgetManager: AppWidgetManager, appWidgetId: Int) {
        try {
            val views = RemoteViews(context.packageName, R.layout.rise_widget)
            appWidgetManager.updateAppWidget(appWidgetId, views)
        } catch (e: Exception) {
            // Silently fail or log if possible
        }
    }
}
