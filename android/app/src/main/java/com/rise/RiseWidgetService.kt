package com.rise

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.RemoteViews
import android.widget.RemoteViewsService
import org.json.JSONArray
import android.util.Log

class RiseWidgetService : RemoteViewsService() {
    override fun onGetViewFactory(intent: Intent): RemoteViewsFactory {
        return RiseWidgetFactory(applicationContext)
    }
}

class RiseWidgetFactory(private val context: Context) : RemoteViewsService.RemoteViewsFactory {
    
    private var items: MutableList<WidgetItem> = mutableListOf()
    
    data class WidgetItem(
        val id: String,
        val title: String,
        val status: String,
        val type: String,
        val category: String
    )

    override fun onCreate() {
        Log.d("RiseWidget", "Factory onCreate")
    }

    override fun onDataSetChanged() {
        Log.d("RiseWidget", "Factory onDataSetChanged")
        items.clear()
        try {
            val sharedPref = context.getSharedPreferences("RiseWidgetPrefs", Context.MODE_PRIVATE)
            val dataString = sharedPref.getString("widgetData", "[]") ?: "[]"
            val selectedLabel = sharedPref.getString("selectedLabel", "All") ?: "All"
            
            Log.d("RiseWidget", "Data: ${dataString.take(200)}")
            Log.d("RiseWidget", "Selected label: $selectedLabel")
            
            val jsonArray = JSONArray(dataString)
            for (i in 0 until jsonArray.length()) {
                val obj = jsonArray.getJSONObject(i)
                val id = obj.optString("id", "")
                
                // Skip the login marker
                if (id == "__not_logged_in__") continue
                
                val category = obj.optString("category", "Inbox")
                val type = obj.optString("type", "task")
                
                // Filter by selected label (if not "All")
                // For habits, always show them (they don't have categories)
                if (selectedLabel != "All" && type == "task" && category != selectedLabel) {
                    continue
                }
                
                items.add(WidgetItem(
                    id = id,
                    title = obj.optString("title", "Task"),
                    status = obj.optString("status", "pending"),
                    type = type,
                    category = category
                ))
            }
            Log.d("RiseWidget", "Filtered to ${items.size} items for label: $selectedLabel")
        } catch (e: Exception) {
            Log.e("RiseWidget", "Error loading data", e)
        }
    }

    override fun onDestroy() {
        items.clear()
    }

    override fun getCount(): Int = items.size

    override fun getViewAt(position: Int): RemoteViews {
        val views = RemoteViews(context.packageName, R.layout.widget_item)
        
        if (position < items.size) {
            val item = items[position]
            
            // Set checkbox based on status
            val isCompleted = item.status.equals("completed", ignoreCase = true)
            views.setTextViewText(R.id.widget_item_checkbox, if (isCompleted) "✓" else "○")
            views.setTextColor(R.id.widget_item_checkbox, 
                if (isCompleted) 0xFF4CAF50.toInt() else 0xFFFFFFFF.toInt())
            
            // Set title
            views.setTextViewText(R.id.widget_item_title, item.title)
            
            // Gray out for completed tasks
            views.setTextColor(R.id.widget_item_title, 
                if (isCompleted) 0xFF888888.toInt() else 0xFFFFFFFF.toInt())
            
            // Set fill-in intent for item click (toggle completion)
            val fillIntent = Intent().apply {
                data = Uri.parse("rise://toggle/${item.id}/${item.type}")
            }
            views.setOnClickFillInIntent(R.id.widget_item_container, fillIntent)
        }
        
        return views
    }

    override fun getLoadingView(): RemoteViews? = null
    
    override fun getViewTypeCount(): Int = 1
    
    override fun getItemId(position: Int): Long = position.toLong()
    
    override fun hasStableIds(): Boolean = false
}
