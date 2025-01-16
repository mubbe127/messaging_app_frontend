function formatDate(date) {
    const now = new Date();
    const targetDate = new Date(date);
    
    // Check if the date is today
    const isToday = targetDate.toDateString() === now.toDateString();
    
    // Check if the date is in the last 5 days
    const diffInDays = Math.floor((now - targetDate) / (1000 * 60 * 60 * 24));
    
    // Format the date
    if (isToday) {
      // Today - show only time in HH:mm format
      return targetDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays <= 5) {
      // Last 5 days - show day of the week and time
      return targetDate.toLocaleString('en-GB', { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    } else {
      // Older than 5 days - show full date in YYYY-MM-DD HH:mm format
      return targetDate.toLocaleString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    }
  }

  export default formatDate