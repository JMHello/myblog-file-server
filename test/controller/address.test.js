import getAddress from '../../server/controllers/address'

describe('test trie tree', () => {
  test('get 82 provinces', async () => {
    const root = getAddress()
    
    expect(root.edges.length).toBe(83)
  })
})