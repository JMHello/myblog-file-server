class Folder {
  /**
   * 获取文件夹
   * @return {Promise.<*>}
   */
  static async getAllFolders () {
    const sql = `SELECT * FROM folder`
    const [folders] = await global.db.query(sql)

    return folders
  }

  /**
   * 根据id修改文件夹名
   * @param FolderName
   * @param idFolder
   * @return {Promise.<*>}
   */
  static async modifyNameById (FolderName, idFolder) {
    const sql = `UPDATE folder SET FolderName=? WHERE idFolder=?`
    const result = await global.db.query(sql, [FolderName, idFolder])
    return result
  }

  /**
   * 根据id删除文件夹
   * @param idFolder
   * @return {Promise.<*>}
   */
  static async delById (idFolder) {
    // 先查询文件夹里有没有图片
    let sql = `SELECT id FROM img WHERE Folder_id=?`
    let [ids] = await global.db.query(sql, [idFolder])

    if (ids.length > 0) {
      sql = `DELETE FROM img WHERE Folder_id=?`
      await global.db.query(sql, [idFolder])
    }

    // 获取文件夹的名称
    sql = `SELECT name FROM folder WHERE id=?`
    const [nameArr] = await global.db.query(sql, [idFolder])

    // 再删除文件夹
    sql = `DELETE FROM folder WHERE id=?`
    await global.db.query(sql, [idFolder])

    const folders = await this.getAllFolders()

    return {
      folders: folders,
      name: nameArr[0].name
    }
  }

  /**
   * 添加文件夹
   * @param folderDataObject
   * @example {
   * FolderName: "xxx"
   * }
   * @return {Promise.<Number>}
   */
  static async addData (folderDataObject) {
    const sql = `INSERT INTO folder SET ?`
    const idResult = await global.db.query(sql, folderDataObject)

    const result = await this.getAllFolders()

    return {
      id: idResult,
      folders: result
    }
  }
}

module.exports =  Folder