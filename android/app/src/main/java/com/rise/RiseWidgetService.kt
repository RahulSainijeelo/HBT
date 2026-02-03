package com.rise

import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.net.Uri
import android.view.View
import android.widget.RemoteViews
import android.widget.RemoteViewsService
import org.json.JSONArray
import android.util.Log
import java.text.SimpleDateFormat
import java.util.Locale

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
        val category: String,
        val dueDate: String,
        val dueTime: String?,
        val priority: Int,
        val isDateHeader: Boolean = false
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
            
            Log.d("RiseWidget", "Selected label: $selectedLabel")
            
            val jsonArray = JSONArray(dataString)
            val tempItems = mutableListOf<WidgetItem>()
            
            for (i in 0 until jsonArray.length()) {
                val obj = jsonArray.getJSONObject(i)
                val id = obj.optString("id", "")
                
                if (id == "__not_logged_in__") continue
                
                val category = obj.optString("category", "Inbox")
                val type = obj.optString("type", "task")
                
                if (selectedLabel != "All" && type == "task" && category != selectedLabel) {
                    continue
                }
                
                tempItems.add(WidgetItem(
                    id = id,
                    title = obj.optString("title", "Task"),
                    status = obj.optString("status", "pending"),
                    type = type,
                    category = category,
                    dueDate = obj.optString("dueDate", ""),
                    dueTime = if (obj.has("dueTime") && !obj.isNull("dueTime")) obj.optString("dueTime") else null,
                    priority = obj.optInt("priority", 4)
                ))
            }
            
            tempItems.sortBy { it.dueDate }
            
            // Group by date with headers
            var lastDate = ""
            for (item in tempItems) {
                if (item.dueDate.isNotEmpty() && item.dueDate != lastDate) {
                    items.add(WidgetItem(
                        id = "header_${item.dueDate}",
                        title = formatDateHeader(item.dueDate),
                        status = "",
                        type = "header",
                        category = "",
                        dueDate = item.dueDate,
                        dueTime = null,
                        priority = 0,
                        isDateHeader = true
                    ))
                    lastDate = item.dueDate
                }
                items.add(item)
            }
            
            Log.d("RiseWidget", "Total items including headers: ${items.size}")
        } catch (e: Exception) {
            Log.e("RiseWidget", "Error loading data", e)
        }
    }
    
    private fun formatDateHeader(dateStr: String): String {
        return try {
            val inputFormat = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
            val date = inputFormat.parse(dateStr)
            val today = inputFormat.format(java.util.Date())
            val tomorrow = inputFormat.format(java.util.Date(System.currentTimeMillis() + 86400000))
            
            when (dateStr) {
                today -> "Today"
                tomorrow -> "Tomorrow"
                else -> {
                    val outputFormat = SimpleDateFormat("EEE, MMM d", Locale.getDefault())
                    outputFormat.format(date!!)
                }
            }
        } catch (e: Exception) {
            dateStr
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
            
            if (item.isDateHeader) {
                // Date header styling
                views.setTextViewText(R.id.widget_item_title, item.title)
                views.setTextColor(R.id.widget_item_title, 0xFF888888.toInt())
                views.setFloat(R.id.widget_item_title, "setTextSize", 11f)
                views.setTextViewText(R.id.widget_item_datetime, "")
                views.setTextViewText(R.id.widget_item_type, "")
                views.setViewVisibility(R.id.widget_item_priority, View.INVISIBLE)
                views.setViewVisibility(R.id.widget_item_checkbox, View.INVISIBLE)
                views.setOnClickFillInIntent(R.id.widget_item_container, Intent())
            } else {
                val isCompleted = item.status.equals("completed", ignoreCase = true)
                
                // Checkbox
                views.setViewVisibility(R.id.widget_item_checkbox, View.VISIBLE)
                if (isCompleted) {
                    views.setImageViewResource(R.id.widget_item_checkbox, R.drawable.widget_checkbox_filled)
                } else {
                    views.setImageViewResource(R.id.widget_item_checkbox, R.drawable.widget_checkbox)
                }
                
                // Title
                views.setTextViewText(R.id.widget_item_title, item.title)
                views.setFloat(R.id.widget_item_title, "setTextSize", 13f)
                views.setTextColor(R.id.widget_item_title, 
                    if (isCompleted) 0xFF666666.toInt() else 0xFFFFFFFF.toInt())
                
                // Time
                val dateTimeText = item.dueTime ?: ""
                views.setTextViewText(R.id.widget_item_datetime, dateTimeText)
                
                // Type indicator
                val typeIndicator = if (item.type == "habit") "H" else "T"
                views.setTextViewText(R.id.widget_item_type, typeIndicator)
                views.setTextColor(R.id.widget_item_type, 
                    if (item.type == "habit") 0xFFE91E63.toInt() else 0xFF2196F3.toInt())
                
                // Priority dot - use setColorFilter on ImageView
                views.setViewVisibility(R.id.widget_item_priority, View.VISIBLE)
                val priorityColor = when (item.priority) {
                    1 -> 0xFFFF0000.toInt()
                    2 -> 0xFFFFAB00.toInt()
                    3 -> 0xFF0052CC.toInt()
                    else -> 0xFF444444.toInt()
                }
                views.setInt(R.id.widget_item_priority, "setColorFilter", priorityColor)
                
                // Fill-in intent for toggle
                val fillIntent = Intent().apply {
                    putExtra("itemId", item.id)
                    putExtra("itemType", item.type)
                }
                views.setOnClickFillInIntent(R.id.widget_item_container, fillIntent)
            }
        }
        
        return views
    }

    override fun getLoadingView(): RemoteViews? = null
    
    override fun getViewTypeCount(): Int = 1
    
    override fun getItemId(position: Int): Long = position.toLong()
    
    override fun hasStableIds(): Boolean = false
}
