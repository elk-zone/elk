// Handles browser quirks, based on
// https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API/Using_the_Notifications_API
export const requestNotificationPermission = async () => {
  if (checkNotificationPromise())
    await Notification.requestPermission().then(permission => handlePermission(permission)).catch(console.warn)
  else
    await Notification.requestPermission(permission => handlePermission(permission))

  return Notification.permission
}

function checkNotificationPromise() {
  try {
    Notification.requestPermission().then()
  }
  catch (e) {
    return false
  }

  return true
}

function handlePermission(permission: NotificationPermission) {
  // Whatever the user answers, we make sure Chrome stores the information
  if (!('permission' in Notification))
    Notification.permission = permission
}

