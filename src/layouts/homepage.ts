/* eslint-disable indent */

import html from 'outdent'

import type { Layout } from '../data-types.js'
import config from '../config.js'

import Container from '../layouts-components/container.js'
import PostList from '../layouts-components/post-list.js'
import Tags from '../layouts-components/tags.js'
import Timeline from '../layouts-components/timeline.js'

interface ContactProps {
  icon: string,
  link: string,
  text: string
}

const Contact: Layout<ContactProps> = () => {
  return {
    layout: (_, props) => html`
    <div class="homepage-contact">
      <img class="homepage-contact-icon"
        src="/${routes.public}/icon/${props?.icon}.svg"
        alt="${props?.icon ?? ''}">
      <a class="homepage-contact-link" href="${props?.link ?? ''}">${props?.text}</a>
    </div>
    `
  }
}

const routes = config.routes

const Homepage: Layout = () => {
  return {
    layout: (meta) => html`
    ${Container().layout(meta, {
      content: html`
      <div class="homepage-container">
        <div class="homepage-information">
          <div class="homepage-me">
            <div class="homepage-me-icon-container">
              <img class="homepage-me-icon" src="/${routes.public}/idlist.png" alt="idlist">
            </div>
            <div class="homepage-me-name">i'DLisT</div>
          </div>
          ${Contact().layout(meta, { icon: 'email', text: 'me@idl.ist', link: 'mailto:me@idl.ist' })}
          ${Contact().layout(meta, { icon: 'home', text: 'idl.ist', link: 'https://idl.ist' })}
          ${Contact().layout(meta, { icon: 'github', text: 'idlist', link: 'https://github.com/idlist' })}
          ${Contact().layout(meta, { icon: 'twitter', text: '@i_dlist', link: 'https://twitter.com/i_dlist' })}
          ${Contact().layout(meta, { icon: 'soundcloud', text: 'i\'DLisT', link: 'https://soundcloud.com/idlist' })}
          <div class="homepage-stat">
            ${meta?.postNumber
            ? html`<div>共有 <b>${meta?.postNumber}</b> 篇文章。</div>`
            : html`<div>没有文章。</div>`}
          </div>
          ${Tags().layout(meta)}
          ${Timeline().layout(meta)}
        </div>
        <div class="homepage">
        ${PostList().layout(meta, { route: routes.page })}
        </div>
      </div>
    `})}
    `,
    parentLayout: 'base',
    parentMeta: {
      head: html`
      <link rel="stylesheet" type="text/css" href="/${routes.assets}/homepage.css">
      `,
      scripts: [`/${routes.assets}/homepage.js`]
    }
  }
}

export default Homepage