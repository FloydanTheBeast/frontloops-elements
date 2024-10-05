import { css, html, LitElement } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

const API_BASE_URL = 'https://api.jikan.moe/v4/anime?limit=5&q=';

// Icons from Tabler pack, source - https://icones.js.org/collection/tabler
const loaderIcon = html`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="32"
  height="32"
  viewBox="0 0 24 24"
>
  <path
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    d="M12 6V3m4.25 4.75L18.4 5.6M18 12h3m-4.75 4.25l2.15 2.15M12 18v3m-4.25-4.75L5.6 18.4M6 12H3m4.75-4.25L5.6 5.6"
  />
</svg>`;

const starIcon = html`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="32"
  height="32"
  viewBox="0 0 24 24"
>
  <path
    fill="currentColor"
    d="m8.243 7.34l-6.38.925l-.113.023a1 1 0 0 0-.44 1.684l4.622 4.499l-1.09 6.355l-.013.11a1 1 0 0 0 1.464.944l5.706-3l5.693 3l.1.046a1 1 0 0 0 1.352-1.1l-1.091-6.355l4.624-4.5l.078-.085a1 1 0 0 0-.633-1.62l-6.38-.926l-2.852-5.78a1 1 0 0 0-1.794 0z"
  />
</svg>`;

const linkIcon = html`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="32"
  height="32"
  viewBox="0 0 24 24"
>
  <path
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    d="M12 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6m-7 1l9-9m-5 0h5v5"
  />
</svg>`;

const debounce = (fn: (...args: any[]) => unknown, ms: number) => {
  let timeout: number;

  return (...args: Parameters<typeof fn>) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(fn.bind(this, ...args), ms);
  };
};

@customElement('suggest-input')
class SuggestInput extends LitElement {
  static styles = css`
    .input-container {
      position: relative;
      width: 400px;
    }

    .dropdown-container {
      position: absolute;
      left: 0;
      right: 0;
      margin-top: 16px;
      background-color: #fff;
      border-radius: 8px;
      padding: 12px;
      box-shadow: 1px 0px 5px rgba(0, 0, 0, 0.4);
    }

    .dropdown-container ul {
      list-style: none;
      padding: 0;
    }

    .search-input {
      border: none;
      border-bottom: 2px solid #c8c8c8;
      outline: none;
      width: 100%;
      padding: 12px 0;
      font-size: 16px;
    }

    .search-input:focus {
      border-color: #323232;
    }

    .loader {
      display: flex;
      justify-content: center;

      & svg {
        color: #c8c8c8;
        width: 32px;
        height: 32px;
        animation: rotating 2s linear infinite;
      }
    }

    @keyframes rotating {
      from {
        transform: rotateZ(0deg);
      }

      to {
        transform: rotateZ(360deg);
      }
    }
  `;

  private _value = '';
  private makeApiRequestDebounced = debounce(this.makeApiRequest.bind(this), 500);

  @state()
  set value(val: string) {
    this._value = val;

    if (!val) {
      this.data = [];
      return;
    }

    this.loading = true;
    this.makeApiRequestDebounced(val);
  }

  @state()
  data: ApiItem[] = [];

  get value() {
    return this._value;
  }

  @state()
  loading = false;

  @query('.search-input')
  input!: HTMLInputElement;

  private async makeApiRequest(q: string) {
    // Delay for testing purposes
    await new Promise(resolve => setTimeout(resolve, 500));
    const res = await fetch(`${API_BASE_URL}${q}`);
    const json = await res.json();
    this.data = (json.data as any[]).map<ApiItem>(item => ({
      id: item.mal_id,
      title: item.title_english || item.title,
      url: item.url,
      imageUrl: item.images.jpg?.small_image_url,
      score: item.score,
    }));

    this.loading = false;
  }

  private handleInputChange() {
    this.value = this.input.value;
  }

  protected render(): unknown {
    return html`
      <div class="input-container">
        <input tabindex="0" type="text" class="search-input" @input=${this.handleInputChange} />
        ${this.value || this.loading
          ? html`<div class="dropdown-container">
              ${this.loading
                ? html`<div class="loader">${loaderIcon}</div>`
                : this.data.length
                ? html`<ul>
                    ${repeat(
                      this.data,
                      ({ id }) => id,
                      (item, i) =>
                        html`<dropdown-item
                          .tabIndex=${i + 1}
                          .item=${item}
                          .onSelect=${(value: string) => (this.input.value = value)}
                        />`,
                    )}
                  </ul>`
                : 'Nothing was found'}
            </div>`
          : undefined}
      </div>
    `;
  }
}

@customElement('dropdown-item')
class DropdownItem extends LitElement {
  static styles = css`
    .dropdown-item {
      position: relative;
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      column-gap: 8px;
      justify-content: space-between;
      padding: 16px 12px;
      border-radius: 4px;
      cursor: pointer;

      &:hover,
      &:focus-visible {
        background-color: #f1f1f1;
        outline: none;
      }

      & .primary-info {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
      }

      & img {
        height: 60px;
        width: 40px;
        margin-right: 8px;
      }

      & .rating {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;

        & b {
          margin-right: 4px;
          font-size: 14px;
        }

        & svg {
          width: 14px;
          color: #f1c40f;
        }
      }

      & .link-icon {
        position: absolute;
        top: 4px;
        right: 4px;

        & svg {
          width: 16px;
          height: 16px;
          color: #c8c8c8;
        }
      }
    }
  `;

  constructor() {
    super();

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
  }

  @property({ type: Object })
  item!: ApiItem;

  @property({ type: Number })
  tabIndex!: number;

  @property({ type: Object })
  onSelect!: (value: string) => void;

  @state()
  isAltKeyPressed = false;

  connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener('keydown', this.onKeyDown);
    document.removeEventListener('keyup', this.onKeyUp);
  }

  private onKeyDown(e: KeyboardEvent) {
    if (this.shadowRoot?.activeElement && (e.key === 'Meta' || e.altKey)) {
      this.isAltKeyPressed = true;
    }
  }

  private onKeyUp(e: KeyboardEvent) {
    this.isAltKeyPressed = false;
  }

  private handleSelect() {
    if (this.isAltKeyPressed) {
      window.open(this.item.url, '_blank');
      return;
    }

    this.onSelect(this.item.title);
  }

  protected render(): unknown {
    return html`<li
      tabindex=${this.tabIndex}
      class="dropdown-item"
      @click=${this.handleSelect}
      @keydown=${(e: KeyboardEvent) => {
        if (e.key === 'Enter') {
          this.handleSelect();
        }
      }}
    >
      <div class="primary-info">
        <img src=${this.item.imageUrl} />
        <p>${this.item.title}</p>
      </div>
      ${this.item.score
        ? html`<div class="rating"><b>${this.item.score}/10</b>${starIcon}</div>`
        : undefined}
      ${this.isAltKeyPressed ? html`<div class="link-icon">${linkIcon}</div>` : undefined}
    </li>`;
  }
}

type ApiItem = {
  id: number;
  title: string;
  url: string;
  imageUrl: string;
  score: number;
};
