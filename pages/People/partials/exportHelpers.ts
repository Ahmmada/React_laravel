export const submitExcelExport = () => {
  const filters = JSON.parse(localStorage.getItem('peopleFilters') || '{}');
  const columns = JSON.parse(localStorage.getItem('peopleColumns') || '[]');

  const form = document.createElement('form');
  form.method = 'POST';
  form.action = route('people.report.export.excel');

  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

  const csrf = document.createElement('input');
  csrf.type = 'hidden';
  csrf.name = '_token';
  csrf.value = csrfToken;
  form.appendChild(csrf);

  const filtersInput = document.createElement('input');
  filtersInput.type = 'hidden';
  filtersInput.name = 'filters';
  filtersInput.value = JSON.stringify(filters);
  form.appendChild(filtersInput);

  columns.forEach((col: string) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'columns[]';
    input.value = col;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
};

export const submitPdfExport = () => {
  const filters = JSON.parse(localStorage.getItem('peopleFilters') || '{}');
  const columns = JSON.parse(localStorage.getItem('peopleColumns') || '[]');

  const form = document.createElement('form');
  form.method = 'POST';
  form.action = route('people.report.export.pdf');

  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

  const csrf = document.createElement('input');
  csrf.type = 'hidden';
  csrf.name = '_token';
  csrf.value = csrfToken;
  form.appendChild(csrf);

  const filtersInput = document.createElement('input');
  filtersInput.type = 'hidden';
  filtersInput.name = 'filters';
  filtersInput.value = JSON.stringify(filters);
  form.appendChild(filtersInput);

  columns.forEach((col: string) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'columns[]';
    input.value = col;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
};