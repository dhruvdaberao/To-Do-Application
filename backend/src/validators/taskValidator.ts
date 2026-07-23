import { Request, Response, NextFunction } from 'express';

export const validateTask = (req: Request, res: Response, next: NextFunction): void => {
  const { title, description, dateTime, deadline, priority, category } = req.body;

  if (!title || title.length < 3 || title.length > 100) {
    res.status(400).json({ success: false, message: 'Title must be between 3 and 100 characters' });
    return;
  }

  if (description && description.length > 500) {
    res.status(400).json({ success: false, message: 'Description cannot exceed 500 characters' });
    return;
  }

  if (!dateTime || isNaN(Date.parse(dateTime))) {
    res.status(400).json({ success: false, message: 'Valid dateTime is required' });
    return;
  }

  if (!deadline || isNaN(Date.parse(deadline))) {
    res.status(400).json({ success: false, message: 'Valid deadline is required' });
    return;
  }

  const dt = new Date(dateTime);
  const dl = new Date(deadline);

  if (dl < dt) {
    res.status(400).json({ success: false, message: 'Deadline cannot be before dateTime' });
    return;
  }

  if (priority && !['LOW', 'MEDIUM', 'HIGH'].includes(priority)) {
    res.status(400).json({ success: false, message: 'Invalid priority. Must be LOW, MEDIUM, or HIGH' });
    return;
  }

  if (category && !['Work', 'Personal', 'College', 'Shopping', 'Health', 'Other', 'General'].includes(category)) {
    res.status(400).json({ success: false, message: 'Invalid category' });
    return;
  }

  next();
};
