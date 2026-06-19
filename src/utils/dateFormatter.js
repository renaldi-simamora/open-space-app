import { formatDistanceToNow, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

export const formatDate = (dateString) => {
  try {
    return formatDistanceToNow(parseISO(dateString), { addSuffix: true, locale: id });
  } catch {
    return dateString;
  }
};
