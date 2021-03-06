package models

case class Directory(id: Long,
                     name: String,
                     label: String,
                     description: String,
                     order: Int,
                     relativePath: String,
                     path: String,
                     branchId: Long,
                     pages: Seq[Page] = Seq(),
                     children: Seq[Directory] = Seq())
