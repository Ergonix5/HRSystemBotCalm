const Product = {
  create: async (data: any) => data,
  find: () => ({ sort: async (sortObj?: any) => [] }),
  findByIdAndUpdate: async (id: string, data: any, options: any) => data,
  findByIdAndDelete: async (id: string) => null
}

export default Product