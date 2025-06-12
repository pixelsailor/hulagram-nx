// using mutative is "expensive." consider using `requestUpdate` instead to decrease file size by 20 kB
import { create } from 'mutative';
import { LitElement, html, css } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { v4 as uuid } from 'uuid';

class CxiiPlaylist extends LitElement {
  static styles = css`
    .cxii-playlists__track__container {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 2rem;
    }
  `;
  static properties = {
    artistName: {},
    releaseDate: {},
    tracks: { type: Array },
    archive: {},
  }
  constructor() {
    super();
    this.artistName = '';
    this.releaseDate = '';
    this.tracks = [];
    this.archive = '';
  }

  // Need to render to the Light DOM to make input values accessible to PHP parent
  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <table class="form-table">
        <tbody>
          <tr>
            <th scope="row">
              <label for="cxii_artist_name">Playlist/Album artist:</label>
            </th>
            <td>
              <input type="text" id="cxii_artist_name" class="regular-text" name="cxii_artist_name" .value="${this.artistName}" />
            </td>
          </tr>
          <tr>
            <th scope="row">
              <label for="cxii_release_date">Release date:</label>
            </th>
            <td>
              <input type="date" id="cxii_release_date" class="regular-text" name="cxii_release_date" .value="${this.releaseDate}" />
            </td>
          </tr>
          <tr>
            <th scope="row">
              <label for="cxii_playlist_archive">Downloadable archive</label>
            </th>
            <td>
              <input
                type="text"
                class="cxii__track__file regular-text"
                name="cxii_playlist_archive"
                .value="${this.archive || ''}"
                @click=${() => !this.archive ? this._openArchiveBrowser() : null}
                readonly
              />
              <button type="button" class="button select-media" @click=${() => this._openArchiveBrowser()}>Select file</button>
            </td>
          </tr>
          ${this.tracks.length
            ? html`
              ${repeat(
                this.tracks,
                (track) => track.id,
                (track, index) => html`
                  <tr>
                    <td style="border-bottom: 1px solid #999;">
                      <span>${index + 1}.</span>
                    </td>
                    <td style="border-bottom: 1px solid #999;">
                      <div
                        class="cxii-playlists__track__container"
                        style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 2rem;"
                      >
                        <div class="cxii-playlists__track__meta">
                          <div class="cxii__form-field" style="margin: 1rem 0">
                            <label class="title cxii__form-field__label" style="padding-bottom: 0.25rem; display: block">Song file</label>
                            <input
                              type="text"
                              class="cxii__track__file regular-text"
                              .value="${track.file || ''}"
                              @click=${() => !track.file ? this._openMediaBrowser(index) : null}
                              readonly
                            />
                            <button type="button" class="button select-media" @click=${() => this._openMediaBrowser(index)}>Select file</button>
                          </div>
                          <div class="cxii__form-field" style="margin: 1rem 0">
                            <label class="cxii__form-field__label title" style="padding-bottom: 0.25rem; display: block">Track title</label>
                            <input
                              type="text"
                              class="cxii__track__title regular-text form-field__text"
                              .value="${track.title || ''}"
                              @input=${(e) => this._handleInputChange(e, index, 'title')}
                            />
                          </div>
                          <div class="cxii__form-field" style="margin: 1rem 0">
                            <label class="title cxii__form-field__label" style="padding-bottom: 0.25rem; display: block">Written by</label>
                            <input
                              type="text"
                              class="cxii__track__artist regular-text form-field__text"
                              .value="${track.artist || ''}"
                              @input=${(e) => this._handleInputChange(e, index, 'artist')}
                            />
                          </div>
                          <div class="cxii__form-field" style="margin: 1rem 0">
                            <label>
                              <input
                                type="checkbox"
                                class="cxii__track__downloadable form-field__checkbox"
                                ?checked=${track.downloadable}
                                @click=${(e) => this._handleInputChange(e, index, 'downloadable')}
                              />
                              <span class="checkbox-title">Downloadable</span>
                            </label>
                          </div>
                        </div>
                        <div class="track__lyrics cxii__form-field" style="margin: 1rem 0">
                          <label class="title cxii__form-field__label" style="padding-bottom: 0.25rem; display: block">Lyrics</label>
                          <textarea
                            class="cxii__track__lyrics regular-text form-field__textarea"
                            style="display: block; width: 100%"
                            rows="8"
                            .value="${track.lyrics || ''}"
                            @change=${(e) => this._handleInputChange(e, index, 'lyrics')}
                          ></textarea>
                        </div>
                      </div>
                      <div>
                        <button type="button form-field__button" class="button" @click=${() => this._removeTrackHandler(index)}>Remove track</button>
                      </div>
                    <td>
                  </tr>
                `
              )}
            `
            : html`<p>Add some songs</p>`
          }
        </tbody>
      </table>
      <div style="margin: 1rem 0">
        <input type="hidden" name="cxii_tracks_json" .value="${JSON.stringify(this.tracks)}" />
        <button type="button" class="button" @click=${this._addTrackHandler}>Add track</button>
      </div>
    `;
  }

  /** Add a new track to the `tracks` list */
  _addTrackHandler() {
    this.tracks = create(this.tracks, (draft) => {
      draft.push({
        id: uuid(),
        title: '',
        artist: '',
        file: '',
        lyrics: '',
        downloadable: true,
        index: this.tracks.length,
      });
    });
  }

  /**
   * Removes the track from the `tracks` property. `this.tracks` gets reassigned to trigger an 
   * update cycle
   * @param {number} index 
   */
  _removeTrackHandler(index) {
    let tracks = this.tracks.filter((_, i) => i !== index);
    tracks.forEach((_, i) => {
      _.index = i;
    });
    this.tracks = tracks;
  }

  _openArchiveBrowser(index) {
    const frame = window.wp.media({
      title: 'Select a zip archive',
      button: { text: 'Use this file' },
      multiple: false,
      library: { type: 'application/zip' }
    });

    frame.on('select', () => {
      const attachment = frame.state().get('selection').first().toJSON();
      this.archive = attachment.url;
    });

    frame.open();
  }

  /**
   * Uses the global `wp.media` to browse and attach WordPress media files
   * @param {number} index
   */
  _openMediaBrowser(index) {
    const frame = window.wp.media({
      title: 'Select or upload track',
      button: { text: 'Use this file' },
      multiple: false,
      library: { type: 'audio' }
    });

    frame.on('select', () => {
      const attachment = frame.state().get('selection').first().toJSON();
      // let track = this.tracks[index];
      // track.file = attachment.url;
      // this.requestUpdate();
      this.tracks = create(this.tracks, (draft) => {
        draft[index].file = attachment.url;

        // update fields based on media meta
        if (attachment.title) {
          draft[index].title = attachment.title;
        }
        if (attachment.meta?.artist) {
          draft[index].artist = attachment.meta.artist;
        }
      });
    });

    frame.open();
  }

  /**
   * Updates the `tracks` property and triggers an update cycle
   * @param {Object} event - HTMLInputEvent
   * @param {number} index - Index value of the item in the `tracks` array
   * @param {string} field - Corresponding property name for the item in the `tracks` array
   */
  _handleInputChange(event, index, field) {
    const { checked, value } = event.target;
    this.tracks = create(this.tracks, (draft) => {
      draft[index][field] = field === 'downloadable' ? checked : value;
    });
  }
}

window.customElements.define('cxii-playlist', CxiiPlaylist);
