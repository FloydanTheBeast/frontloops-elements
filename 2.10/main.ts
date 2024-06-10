import { LitElement, html, css } from 'lit';
import { customElement, property, queryAll, state } from 'lit/decorators.js';

type AccordionItem = {
  title: string;
  text: string;
};

enum ACCORDION_ITEM_MODIFIERS {
  expanded = 'accordion__item--expanded',
  prerender = 'accordion__item--prerender',
}

@customElement('custom-accordion')
class CustomAccordion extends LitElement {
  static styles = css`
    .accordion {
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;
      align-items: center;
      border-radius: 4px;
    }

    .accordion__item {
      position: relative;
      height: fit-content;
      width: 400px;
      background-color: #fff;
      border: 1px solid #eee;
      cursor: pointer;
      transition: all 0.15s ease-in-out;
      user-select: none;
    }

    .accordion__item:first-child {
      border-radius: 4px 4px 0 0;
    }

    .accordion__item:last-child {
      border-radius: 0 0 4px 4px;
    }

    .accordion__item .accordion__title {
      font-size: 14px;
      padding: 16px;
      margin: 0;
    }

    .accordion__item .accordion__content {
      font-size: 14px;
      overflow: hidden;
      transition: height 0.25s ease-in-out;
      height: 0;
      padding: 0 16px;
    }

    .accordion__item--prerender .accordion__content {
      height: auto;
    }

    .accordion__item--expanded {
      padding: 0 16px;
      border-radius: 4px !important;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
      z-index: 100;
    }

    .accordion__item--expanded .accordion__content {
      padding-bottom: 16px;
    }
  `;

  @property({ type: Array })
  items: AccordionItem[] = [];

  @state()
  selectedItemId: number | null = null;

  @queryAll('.accordion__item')
  _accordionItems!: HTMLDivElement[];

  @queryAll('.accordion__content')
  _accordionContents!: HTMLDivElement[];

  _changeSelectedItem(newSelectedItemId: number) {
    const prevItemId = this.selectedItemId;

    if (prevItemId !== null) {
      this._collapseItem(prevItemId);
      this.selectedItemId = null;
    }

    if (newSelectedItemId !== prevItemId) {
      this._expandItem(newSelectedItemId);
      this.selectedItemId = newSelectedItemId;
    }
  }

  _collapseItem(id: number) {
    this._accordionItems[id].classList.remove(ACCORDION_ITEM_MODIFIERS.expanded);
    this._accordionContents[id].style.height = '';
  }

  _expandItem(id: number) {
    this._accordionItems[id].classList.add(ACCORDION_ITEM_MODIFIERS.prerender);

    const selectedItemContent = this._accordionContents[id];
    const height = this._accordionContents[id].clientHeight;

    this._accordionItems[id].classList.add(ACCORDION_ITEM_MODIFIERS.expanded);
    this._accordionItems[id].classList.remove(ACCORDION_ITEM_MODIFIERS.prerender);

    // Change height on the next tick so that item doesn't have '--prepender' modifier already
    setTimeout(() => (selectedItemContent.style.height = `${height}px`), 0);
  }

  render() {
    return html`
      <div class="accordion">
        ${this.items?.map(
          (item, i) => html`
            <div class="accordion__item" @click=${() => this._changeSelectedItem(i)}>
              <h3 class="accordion__title">${i + 1}. ${item.title}</h3>
              <div class="accordion__content">${item.text}</div>
            </div>
          `,
        )}
      </div>
    `;
  }
}
