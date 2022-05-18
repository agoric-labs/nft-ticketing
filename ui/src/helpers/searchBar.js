export const getFilteredList = (
  list,
  searchInput,
  option,
  page,
  pageLength,
) => {
  return list
    .filter((el) => {
      if (searchInput === '') {
        return el;
      } else {
        switch (option) {
          case 'Name':
            return el.name
              .toLowerCase()
              .includes(searchInput.toLocaleLowerCase());
          case 'Time':
            return el;
          case 'Tickets Left >=':
            return (
              el.ticketsCount - el.ticketsSold >= parseInt(searchInput, 10)
            );
          default:
        }
      }
      return false;
    })
    .slice(page, pageLength);
};
