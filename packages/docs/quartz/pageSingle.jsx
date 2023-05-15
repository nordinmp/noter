export default function({ content, data }) {
  return <article>
    {content}
  </article>
}

export async function getStaticProps({ content, data }) {
  return {
    props: {}
  }
}
