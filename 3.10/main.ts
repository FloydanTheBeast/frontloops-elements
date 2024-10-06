import { css, html, LitElement } from 'lit';
import { customElement, property, query, queryAssignedElements, state } from 'lit/decorators.js';

@customElement('zoomable-container')
class ZoomableElement extends LitElement {
  static styles = css`
    .container {
      position: relative;
      width: 800px;
    }

    .controls {
      width: 800px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      & .controls-group {
        display: flex;
        align-items: center;
        column-gap: 8px;
      }
    }

    .lens {
      position: absolute;
      top: 0;
      border: 1px solid #eee;
      overflow: hidden;
      border-radius: 50%;
      box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.6);

      & .lens-container {
        margin: 128px;
      }
    }

    ::slotted([slot='element-to-zoom']) {
      position: relative;
      border: 1px dashed #eee;
      box-sizing: border-box;
    }

    ::slotted([slot='element-to-zoom'])::after {
      /* SVG encoded with https://yoksel.github.io/url-encoder/ */
      content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1' d='M4 8V6a2 2 0 0 1 2-2h2M4 16v2a2 2 0 0 0 2 2h2m8-16h2a2 2 0 0 1 2 2v2m-4 12h2a2 2 0 0 0 2-2v-2M8 11a3 3 0 1 0 6 0a3 3 0 0 0-6 0m8 5l-2.5-2.5'/%3E%3C/svg%3E");
      position: absolute;
      display: block;
      height: 32px;
      width: 32px;
      top: -4px;
      pointer-events: none;
      right: -42px;
    }

    slot[name='element-to-zoom']:hover {
      cursor: zoom-in;
    }
  `;

  @property({ type: Number })
  zoom: number = 2;

  @property({ type: Number })
  lensSize: number = 128;

  @queryAssignedElements({ slot: 'element-to-zoom' })
  elements!: Array<HTMLElement>;

  @query('.container')
  container!: HTMLDivElement;

  @query('.lens')
  lens: HTMLDivElement | undefined;

  @query('.lens-container')
  lensContainer: HTMLDivElement | undefined;

  @state()
  zoomingElement: HTMLElement | null = null;

  private onMouseEnter(el: HTMLElement) {
    this.zoomingElement = el;

    setTimeout(() => {
      if (this.lensContainer) {
        this.lensContainer?.append(el.cloneNode(true));
        this.lensContainer.style.width = `${this.container.clientWidth}px`;
      }
    });
  }

  private onMouseMove(e: MouseEvent) {
    if (this.lens) {
      this.lens.scrollLeft =
        (e.offsetX + (this.lensContainer?.offsetLeft ?? 0)) * this.zoom - this.lensSize / 2;
      this.lens.scrollTop =
        (e.offsetY + (this.lensContainer?.offsetTop ?? 0)) * this.zoom - this.lensSize / 2;
    }
  }

  private onMouseLeave() {
    this.lensContainer?.replaceChildren();
    this.zoomingElement = null;
  }

  private onSlotChange() {
    this.elements.forEach(el => {
      el.addEventListener('mouseenter', this.onMouseEnter.bind(this, el));
      el.addEventListener('mousemove', this.onMouseMove.bind(this));
      el.addEventListener('mouseleave', this.onMouseLeave.bind(this));
    });
  }

  protected render(): unknown {
    return html`<div class="controls">
        <div class="controls-group">
          <label for="zoom">Change lens zoom:</label>
          <input
            type="range"
            name="zoom"
            min="1"
            max="5"
            step="0.5"
            value=${this.zoom}
            @input=${(e: InputEvent) => (this.zoom = +(e.target as HTMLInputElement).value)}
          />
        </div>
        <p>Current zoom: <b>${this.zoom}</b></p>
      </div>
      <div class="container">
        <slot @slotchange=${this.onSlotChange} name="element-to-zoom"></slot>
        ${this.zoomingElement
          ? html`<div
              class="lens"
              style=${`width: ${this.lensSize}px; height: ${this.lensSize}px; right: ${-(
                this.lensSize + 32
              )}px`}
            >
              <div style=${`zoom: ${this.zoom}`} class="lens-container"></div>
            </div>`
          : undefined}
      </div>`;
  }
}
