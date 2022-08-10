class Store {

  constructor(initState) {
    // Состояние приложения (данные)
    this.state = initState;
    // Слушатели изменений state
    this.listeners = [];
  }

  /**
   * Выбор state
   * @return {Object}
   */
  getState() {
    return this.state;
  }

  /**
   * Установка state
   * @param newState {Object}
   */
  setState(newState) {
    this.state = newState;
    // Оповещаем всех подписчиков об изменении стейта
    for (const listener of this.listeners) {
      listener();
    }
  }

  /**
   * Подписка на изменение state
   * @param callback {Function}
   * @return {Function} Функция для отписки
   */
  subscribe(callback) {
    this.listeners.push(callback);
    // Возвращаем функцию для удаления слушателя
    return () => {
      this.listeners = this.listeners.filter(item => item !== callback);
    }
  }

  /**
   * Добавление товара в корзину
   */

  addItemCart({code, title, price}) {
    let checkItem = true;

    this.setState({
      ...this.state,
      cart: this.state.cart.map(item => {
        if (item.code === code) {
          checkItem = false;
          return {
            ...item,
            count: item.count + 1
          }
        }
        return item;
      })
    });

    if (checkItem) {
      return this.setState({
        ...this.state,
        cart: this.state.cart.concat({code, title, price, count: 1})
      });
    }
  }

  /**
   * Получение количества и суммы для корзины
   */

  calcCountAndSumCart() {
    this.setState({
      ...this.state,
      calcInCart: {
        count: this.state.cart.length
          ? this.state.cart.reduce(sum => sum + 1 , 0)
          : 0,
        sum: this.state.cart.length
          ? this.state.cart.reduce((sum, item) => sum + item.price * item.count , 0)
          : 0,
      }
    })
  }

  /**
   * Удаление записи по её коду из корзины
   * @param code
   */
  deleteItemCart(code) {
    this.setState({
      ...this.state,
      cart: this.state.cart.filter(item => item.code !== code)
    });
  }
}

export default Store;
