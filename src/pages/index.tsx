import Link from 'next/link'
import Header from '../components/header'
import Headline from '../components/headline'

import { FiArrowUpRight } from 'react-icons/fi'
import { getBlogLink, getCategoryLink } from '../lib/blog-helpers'

import getBlogIndex from '../lib/notion/getBlogIndex'
import { textBlock } from '../lib/notion/renderers'

export async function getStaticProps({ preview }) {
  const postsTable = await getBlogIndex()

  const today = new Date().getTime()

  const posts = postsTable.filter(
    (post) => preview || (post.Published && post.Date < today)
  )

  return {
    props: {
      preview: preview || false,
      posts,
    },
    revalidate: 5,
  }
}

const Index = ({ posts = [], preview }) => {
  const Comp = 'img'

  return (
    <>
      <Header titlePre="Home" />

      <div className="main-container">
        <Headline />

        {posts.length === 0 && (
          <p className={'blogStyles.noPosts'}>There are no posts yet</p>
        )}

        <div className="cases">
          <div className="cases-wrapper">
            <div className="case-container">
              <div className="content-list">
                {posts.map((post) => {
                  ///////////////////////////////
                  // PODCAST LOOP
                  if (post.Project == 'podcast') {
                    return (
                      <div className={'postPreview'} key={post.Slug}>
                        <div className="content-container">
                          <h3>
                            <span className={'titleContainer'}>
                              {!post.Published && (
                                <span className={'draftBadge'}>Draft</span>
                              )}
                              <Link
                                href={getBlogLink(post.Slug)}
                                as={getBlogLink(post.Slug)}
                              >
                                <a className="post-number">{post.Number}</a>
                              </Link>
                              <Link
                                href={getBlogLink(post.Slug)}
                                as={getBlogLink(post.Slug)}
                              >
                                <a>{post.Page}</a>
                              </Link>
                            </span>
                          </h3>
                          <Link
                            href={getCategoryLink(post.Type)}
                            as={getCategoryLink(post.Type)}
                          >
                            <a>
                              {post.Type && (
                                <div className="tag">#{post.Type}</div>
                              )}
                            </a>
                          </Link>
                          <p className="preview-text">{post.Preview}</p>
                          <Link
                            href={getBlogLink(post.Slug)}
                            as={getBlogLink(post.Slug)}
                          >
                            <a className="postCTA">Chega Mais</a>
                          </Link>
                        </div>

                        <div className="cover-container">
                          {post.Thumb.length > 0 && (
                            <Link
                              href={getBlogLink(post.Slug)}
                              as={getBlogLink(post.Slug)}
                            >
                              <Comp
                                key={post.id}
                                src={post.Thumb}
                                alt={post.Alt}
                                className="cover"
                              />
                            </Link>
                          )}
                        </div>
                      </div>
                    )
                  }
                })}
              </div>
            </div>
          </div>

          <div className="cases-wrapper">
            <div className="case-container otherWork-cases">
              <div className="content-list">
                {posts.map((post) => {
                  ///////////////////////////////
                  // OTHER WORK LOOP
                  if (post.Project != 'podcast') {
                    return (
                      <div className={'postPreview'} key={post.Slug}>
                        <div className="content-container">
                          <h3>
                            <span className={'titleContainer'}>
                              {!post.Published && (
                                <span className={'draftBadge'}>Draft</span>
                              )}
                              <Link
                                href={getBlogLink(post.Slug)}
                                as={getBlogLink(post.Slug)}
                              >
                                <a>
                                  {post.Page} <FiArrowUpRight />
                                </a>
                              </Link>
                            </span>
                          </h3>
                          <Link
                            href={getCategoryLink(post.Type)}
                            as={getCategoryLink(post.Type)}
                          >
                            <a>
                              {post.Type && (
                                <div className="tag">#{post.Type}</div>
                              )}
                            </a>
                          </Link>
                        </div>
                      </div>
                    )
                  }
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Index
