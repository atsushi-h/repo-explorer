export class RateLimitError extends Error {
  constructor() {
    super('APIのリクエスト上限に達しました')
    this.name = 'RateLimitError'
  }
}

export class NotFoundError extends Error {
  constructor() {
    super('リポジトリが見つかりませんでした')
    this.name = 'NotFoundError'
  }
}
