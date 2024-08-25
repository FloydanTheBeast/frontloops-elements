const BASE_API_URL = 'https://pokeapi.co/api/v2/pokemon';
const ITEM_PER_PAGE = 10;

(async () => {
  let page = 1;
  const container = document.querySelector('div.container');
  const itemsList = document.querySelector('div.items-list');
  const loadMoreBtn = document.querySelector('button');

  const fetchEntries = async () => {
    // Prolong the request
    await new Promise(res => setTimeout(res, 1500));

    const res = await (
      await fetch(`${BASE_API_URL}?offset=${page * ITEM_PER_PAGE}&limit=${ITEM_PER_PAGE}`)
    ).json();

    return res['results'];
  };

  const renderEntries = entries => {
    container.style.height = `${container.clientHeight}px`;

    itemsList.append(
      ...entries.map(entry => {
        const entryCard = document.createElement('div');
        entryCard.textContent = entry['name'];
        return entryCard;
      }),
    );

    container.style.height = `${itemsList.clientHeight}px`;
  };

  loadMoreBtn.addEventListener('click', async () => {
    loadMoreBtn.classList.add('loading');
    loadMoreBtn.disabled = true;

    const entries = await fetchEntries();
    page++;
    renderEntries(entries);

    loadMoreBtn.classList.remove('loading');
    loadMoreBtn.disabled = false;
  });
})();
