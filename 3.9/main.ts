import { css, html, LitElement } from 'lit';
import { customElement, query } from 'lit/decorators.js';

@customElement('hightlighted-textarea')
class HightlightedTextarea extends LitElement {
  static styles = css`
    .container {
      width: 100%;
      margin-bottom: -4px;
    }

    .highlights,
    textarea {
      font: 8px Arial;
      letter-spacing: 0;
      padding: 16px;
    }

    .highlights {
      position: absolute;
      z-index: 1;
      font-size: 20px;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      overflow: auto;
      white-space: pre-wrap;
      word-wrap: break-word;
      color: transparent;

      & .highlight {
        background-color: #7fc2ff;
        border-radius: 2px;
      }
    }

    textarea {
      font-size: 20px;
      position: relative;
      z-index: 2;
      background-color: transparent;
      border-radius: 4px;
      border: none;
      outline: none;
    }
  `;

  @query('.highlights')
  highlightsEl!: HTMLDivElement;

  @query('textarea')
  textarea!: HTMLTextAreaElement;

  private getHighlightedText(text: string) {
    return text.replace(/\n$/g, '\n\n').replace(/#[^\s]+/g, '<span class="highlight">$&</span>');
  }

  private handleInput(e: InputEvent) {
    const value = this.textarea.value;
    this.highlightsEl.innerHTML = this.getHighlightedText(value);
  }

  private handleScroll() {
    this.highlightsEl.scrollLeft = this.textarea.scrollLeft;
    this.highlightsEl.scrollTop = this.textarea.scrollTop;
  }

  protected render(): unknown {
    return html`
      <div class="container">
        <div class="highlights"></div>
        <textarea
          @input=${this.handleInput}
          @scroll=${this.handleScroll}
          cols="50"
          rows="10"
        ></textarea>
      </div>
    `;
  }
}
