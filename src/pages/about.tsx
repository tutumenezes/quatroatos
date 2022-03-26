import ExtLink from '../components/ext-link'
import fetch from 'node-fetch'
import Heading from '../components/heading'
import components from '../components/dynamic'
import getBlogIndex from '../lib/notion/getBlogIndex'
import ReactJSXParser from '@zeit/react-jsx-parser'
import { textBlock } from '../lib/notion/renderers'
import Header from '../components/header'
import HeadlineAbout from '../components/headlineAbout'
import profilePic from '../../public/about-tutumenezes-image.webp'
import { postIsPublished } from '../lib/blog-helpers'
import getPageData from '../lib/notion/getPageData'
import { useRouter } from 'next/router'
import React, { CSSProperties, useEffect } from 'react'
import { Loading } from '../components/Loading'

export async function getStaticProps({ preview }) {
  const postsTable = await getBlogIndex()

  const post = postsTable['about']
  const postData = await getPageData(post.id)
  post.content = postData.blocks

  //Get Post Blocks
  for (let i = 0; i < postData.blocks.length; i++) {
    const { value } = postData.blocks[i]
    const { type, properties } = value
    if (type == 'tweet') {
      const src = properties.source[0][0]
      // parse id from https://twitter.com/tutumenezes/status/TWEET_ID format
      const tweetId = src.split('/')[5].split('?')[0]
      if (!tweetId) continue

      try {
        const res = await fetch(
          `https://api.twitter.com/1/statuses/oembed.json?id=${tweetId}`
        )
        const json = await res.json()
        properties.html = json.html.split('<script')[0]
        post.hasTweet = true
      } catch (_) {
        console.log(`Failed to get tweet embed for ${src}`)
      }
    }
  }

  console.log(post)

  return {
    props: {
      preview: preview || false,
      post,
    },
    revalidate: 10,
  }
}

const listTypes = new Set(['bulleted_list', 'numbered_list'])

const About = ({ post, redirect, preview }) => {
  const router = useRouter()

  let listTagName: string | null = null
  let listLastId: string | null = null
  let listMap: {
    [id: string]: {
      key: string
      isNested?: boolean
      nested: string[]
      children: React.ReactFragment
    }
  } = {}

  useEffect(() => {
    const twitterSrc = 'https://platform.twitter.com/widgets.js'
    // make sure to initialize any new widgets loading on
    // client navigation
    if (post && post.hasTweet) {
      if ((window as any)?.twttr?.widgets) {
        ;(window as any).twttr.widgets.load()
      } else if (!document.querySelector(`script[src="${twitterSrc}"]`)) {
        const script = document.createElement('script')
        script.async = true
        script.src = twitterSrc
        document.querySelector('body').appendChild(script)
      }
    }
  }, [])
  useEffect(() => {
    if (redirect && !post) {
      router.replace(redirect)
    }
  }, [redirect, post])

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return (
      <div>
        <Loading />
      </div>
    )
  }

  // if you don't have a post at this point, and are not
  // loading one from fallback then  redirect back to the index
  if (!post) {
    return (
      <div>
        <p>
          Woops! didn't find that post, redirecting you back to the blog index
        </p>
      </div>
    )
  }

  return (
    <>
      <Header titlePre="About" />
      <div className="blog-post main-container">
        <div className="post-content">
          {(!post.content || post.content.length === 0) && (
            <p>Oops, I didn't write about me yet</p>
          )}

          {(post.content || []).map((block, blockIdx) => {
            const { value } = block
            const { type, properties, id, parent_id } = value
            const isLast = blockIdx === post.content.length - 1
            const isList = listTypes.has(type)
            let toRender = []

            if (isList) {
              listTagName = components[type === 'bulleted_list' ? 'ul' : 'ol']
              listLastId = `list${id}`

              listMap[id] = {
                key: id,
                nested: [],
                children: textBlock(properties.title, true, id),
              }

              if (listMap[parent_id]) {
                listMap[id].isNested = true
                listMap[parent_id].nested.push(id)
              }
            }

            if (listTagName && (isLast || !isList)) {
              toRender.push(
                React.createElement(
                  listTagName,
                  { key: listLastId! },
                  Object.keys(listMap).map((itemId) => {
                    if (listMap[itemId].isNested) return null

                    const createEl = (item) =>
                      React.createElement(
                        components.li || 'ul',
                        { key: item.key },
                        item.children,
                        item.nested.length > 0
                          ? React.createElement(
                              components.ul || 'ul',
                              { key: item + 'sub-list' },
                              item.nested.map((nestedId) =>
                                createEl(listMap[nestedId])
                              )
                            )
                          : null
                      )
                    return createEl(listMap[itemId])
                  })
                )
              )
              listMap = {}
              listLastId = null
              listTagName = null
            }

            const renderHeading = (Type: string | React.ComponentType) => {
              toRender.push(
                <Heading key={id}>
                  <Type key={id}>{textBlock(properties.title, true, id)}</Type>
                </Heading>
              )
            }

            const renderBookmark = ({ link, title, description, format }) => {
              const { bookmark_icon: icon, bookmark_cover: cover } = format
              toRender.push(
                <div className={'bookmark'}>
                  <div>
                    <div style={{ display: 'flex' }}>
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        className={'bookmarkContentsWrapper'}
                        href={link}
                      >
                        <div role="button" className={'bookmarkContents'}>
                          <div className={'bookmarkInfo'}>
                            <div className={'bookmarkTitle'}>{title}</div>
                            <div className={'bookmarkDescription'}>
                              {description}
                            </div>
                            <div className={'bookmarkLinkWrapper'}>
                              <img src={icon} className={'bookmarkLinkIcon'} />
                              <div className={'bookmarkLink'}>{link}</div>
                            </div>
                          </div>
                          <div className={'bookmarkCoverWrapper1'}>
                            <div className={'bookmarkCoverWrapper2'}>
                              <div className={'bookmarkCoverWrapper3'}>
                                <img src={cover} className={'bookmarkCover'} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              )
            }

            switch (type) {
              case 'page':
              case 'divider':
                break
              case 'text':
                if (properties) {
                  toRender.push(textBlock(properties.title, false, id))
                }
                break
              case 'image':
              case 'video':
              case 'embed': {
                const { format = {} } = value
                const {
                  block_width,
                  block_height,
                  display_source,
                  block_aspect_ratio,
                } = format
                const baseBlockWidth = 768
                const roundFactor = Math.pow(10, 2)
                // calculate percentages
                const width = block_width
                  ? `${
                      Math.round(
                        (block_width / baseBlockWidth) * 100 * roundFactor
                      ) / roundFactor
                    }%`
                  : block_height || '100%'

                const isImage = type === 'image'
                const Comp = isImage ? 'img' : 'video'
                const useWrapper = block_aspect_ratio && !block_height
                const childStyle: CSSProperties = useWrapper
                  ? {
                      width: '100%',
                      height: '100%',
                      border: 'none',
                      position: 'absolute',
                      top: 0,
                    }
                  : {
                      width,
                      border: 'none',
                      height: block_height,
                      display: 'block',
                      maxWidth: '100%',
                    }

                let child = null

                if (!isImage && !value.file_ids) {
                  // external resource use iframe
                  child = (
                    <iframe
                      style={childStyle}
                      src={display_source}
                      key={!useWrapper ? id : undefined}
                      className={!useWrapper ? 'asset-wrapper' : undefined}
                    />
                  )
                } else {
                  // notion resource
                  child = (
                    <Comp
                      key={!useWrapper ? id : undefined}
                      src={`/api/asset?assetUrl=${encodeURIComponent(
                        display_source as any
                      )}&blockId=${id}`}
                      controls={!isImage}
                      alt={`An ${isImage ? 'image' : 'video'} from Notion`}
                      loop={!isImage}
                      muted={!isImage}
                      autoPlay={!isImage}
                      style={childStyle}
                    />
                  )
                }

                toRender.push(
                  useWrapper ? (
                    <div
                      style={{
                        paddingTop: `${Math.round(block_aspect_ratio * 100)}%`,
                        position: 'relative',
                      }}
                      className="asset-wrapper"
                      key={id}
                    >
                      {child}
                      {properties.caption ? (
                        <div className="caption inside-wrapper">
                          {textBlock(properties.caption, true, id)}
                        </div>
                      ) : (
                        ''
                      )}
                    </div>
                  ) : (
                    <>
                      {child}
                      {properties.caption ? (
                        <div className="caption">
                          {textBlock(properties.caption, true, id)}
                        </div>
                      ) : (
                        ''
                      )}
                    </>
                  )
                )
                break
              }
              case 'header':
                renderHeading('h1')
                break
              case 'sub_header':
                renderHeading('h2')
                break
              case 'sub_sub_header':
                renderHeading('h3')
                break
              case 'bookmark':
                const { link, title, description } = properties
                const { format = {} } = value
                renderBookmark({ link, title, description, format })
                break
              case 'code': {
                if (properties.title) {
                  const content = properties.title[0][0]
                  const language = properties.language[0][0]

                  if (language === 'LiveScript') {
                    // this requires the DOM for now
                    toRender.push(
                      <ReactJSXParser
                        key={id}
                        jsx={content}
                        components={components}
                        componentsOnly={false}
                        renderInpost={false}
                        allowUnknownElements={true}
                        blacklistedTags={['script', 'style']}
                      />
                    )
                  } else {
                    toRender.push(
                      <components.Code key={id} language={language || ''}>
                        {content}
                      </components.Code>
                    )
                  }
                }
                break
              }
              case 'quote': {
                if (properties.title) {
                  toRender.push(
                    React.createElement(
                      components.blockquote,
                      { key: id },
                      properties.title
                    )
                  )
                }
                break
              }
              case 'callout': {
                toRender.push(
                  <div className="callout" key={id}>
                    {value.format?.page_icon && (
                      <div>{value.format?.page_icon}</div>
                    )}
                    <div className="text">
                      {textBlock(properties.title, true, id)}
                    </div>
                  </div>
                )
                break
              }
              case 'tweet': {
                if (properties.html) {
                  toRender.push(
                    <div
                      dangerouslySetInnerHTML={{ __html: properties.html }}
                      key={id}
                    />
                  )
                }
                break
              }
              case 'equation': {
                if (properties && properties.title) {
                  const content = properties.title[0][0]
                  toRender.push(
                    <components.Equation key={id} displayMode={true}>
                      {content}
                    </components.Equation>
                  )
                }
                break
              }
              default:
                if (
                  process.env.NODE_ENV !== 'production' &&
                  !listTypes.has(type)
                ) {
                  console.log('unknown type', type)
                }
                break
            }
            return toRender
          })}
        </div>
      </div>
    </>
  )
}

export default About
