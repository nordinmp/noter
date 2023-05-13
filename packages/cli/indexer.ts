import { read } from 'to-vfile'
import { VFile } from 'vfile'
import { Processor } from 'unified'
import fs from 'fs'

export async function index(remark: Processor, path: string): Promise<VFile> {
  const st = await fs.promises.stat(path)
  const file = await read(path)
  file.data.stat = st
  return remark.process(file)
}

declare module 'vfile' {
  interface DataMap {
    stat: fs.Stats 
  }
}
