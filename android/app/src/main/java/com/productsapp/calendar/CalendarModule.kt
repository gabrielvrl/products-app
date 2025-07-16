package com.productsapp.calendar

import android.app.Activity
import android.content.ContentValues
import android.provider.CalendarContract
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.productsapp.calendar.CalendarUtils


class CalendarModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    @ReactMethod
    fun getAvailableCalendars(promise: Promise) {
        val context = reactApplicationContext
        val projection = arrayOf(
            CalendarContract.Calendars._ID,
            CalendarContract.Calendars.CALENDAR_DISPLAY_NAME,
            CalendarContract.Calendars.ACCOUNT_NAME,
            CalendarContract.Calendars.ACCOUNT_TYPE
        )
        val uri = CalendarContract.Calendars.CONTENT_URI
        val cursor = context.contentResolver.query(uri, projection, null, null, null)
        val calendars = mutableListOf<Map<String, Any>>()
        cursor?.use {
            while (it.moveToNext()) {
                val id = it.getLong(it.getColumnIndexOrThrow(CalendarContract.Calendars._ID))
                val name = it.getString(it.getColumnIndexOrThrow(CalendarContract.Calendars.CALENDAR_DISPLAY_NAME))
                val accountName = it.getString(it.getColumnIndexOrThrow(CalendarContract.Calendars.ACCOUNT_NAME))
                val accountType = it.getString(it.getColumnIndexOrThrow(CalendarContract.Calendars.ACCOUNT_TYPE))
                calendars.add(mapOf(
                    "id" to id,
                    "name" to name,
                    "accountName" to accountName,
                    "accountType" to accountType
                ))
            }
        }
        promise.resolve(calendars)
    }
    override fun getName(): String {
        return "CalendarModule"
    }

    @ReactMethod
    fun addProductReminderToCalendar(title: String, description: String, timestamp: Double, promise: Promise) {
        val context = reactApplicationContext
        val calendarId = CalendarUtils.getGoogleCalendarId(context)
        if (calendarId == null) {
            promise.reject("ERROR", "No calendar found on device")
            return
        }
        val values = ContentValues().apply {
            put(CalendarContract.Events.DTSTART, timestamp.toLong())
            put(CalendarContract.Events.DTEND, timestamp.toLong() + 60 * 60 * 1000) // 1 hour event
            put(CalendarContract.Events.TITLE, title)
            put(CalendarContract.Events.DESCRIPTION, description)
            put(CalendarContract.Events.CALENDAR_ID, calendarId)
            put(CalendarContract.Events.EVENT_TIMEZONE, "UTC")
        }
        try {
            val uri = context.contentResolver.insert(CalendarContract.Events.CONTENT_URI, values)
            if (uri != null) {
                promise.resolve(uri.toString())
            } else {
                promise.reject("ERROR", "Failed to insert event")
            }
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }
}
