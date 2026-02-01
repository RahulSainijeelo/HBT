package com.rise

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.RemoteViews
import android.widget.RemoteViewsService
import org.json.JSONArray
import org.json.JSONObject
import com.rise.R

class RiseWidgetService : RemoteViewsService() {
    override fun onGetViewFactory(intent: Intent): RemoteViewsFactory {
        return RiseWidgetFactory(this.applicationContext)
    }
}

class RiseWidgetFactory(private val context: Context) : RemoteViewsService.RemoteViewsFactory {
    private var items: JSONArray = JSONArray()

    override fun onCreate() {}

    override fun onDataSetChanged() {
        val sharedPref = context.getSharedPreferences("RiseWidgetPrefs", Context.MODE_PRIVATE)
        val dataString = sharedPref.getString("widgetData", "[]")
        try {
            items = JSONArray(dataString)
        } catch (e: Exception) {
            items = JSONArray()
        }
    }

    override fun onDestroy() {}

    override fun getCount(): Int = items.length()

    override fun getViewAt(position: Int): RemoteViews {
        val views = RemoteViews(context.packageName, R.layout.widget_item)
        val item = items.getJSONObject(position)

        val title = item.optString("title", "Unknown")
        val status = item.optString("status", "PENDING")
        val type = item.optString("type", "task") // "task" or "habit"
        val id = item.optString("id", "")

        views.setTextViewText(R.id.widget_item_text, title)
        views.setTextViewText(R.id.widget_item_status, status.uppercase())

        if (status.uppercase() == "COMPLETED") {
            views.setTextColor(R.id.widget_item_status, 0xFF4CAF50.toInt()) // Green
        } else {
            views.setTextColor(R.id.widget_item_status, 0xFFFF3B30.toInt()) // Red
        }

        // Deep link for clinical on item
        val SCHEME = "rise://"
        val uri = Uri.parse("${SCHEME}item/$id/$type")
        val fillInIntent = Intent().apply {
            data = uri
        }
        views.setOnClickFillInIntent(R.id.widget_item_root, fillInIntent)

        return views
    }

    override fun getLoadingView(): RemoteViews? = null
    override fun getViewTypeCount(): Int = 1
    override fun getItemId(position: Int): Long = position.toLong()
    override fun hasStableIds(): Boolean = true
}
