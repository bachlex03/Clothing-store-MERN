import { Sidebar } from '~/layouts/components';

import style from './Shop.module.scss';
import classNames from 'classnames/bind';
import { Fragment, useEffect, useState } from 'react';
import { Product, Text } from '~/components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { useMutation } from '@tanstack/react-query'; // Ensure correct import
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import * as productService from '~/services/api/productService';

import images from '~/assets/images';
import { Link } from 'react-router-dom';

const cx = classNames.bind(style);

function Shop() {
  const [products, setProducts] = useState([]);
  const [wishList, setWishList] = useState(JSON.parse(localStorage.getItem('wishList')) || []);

  const deleteWishList = (product) => {
    const newWishList = wishList.filter((item) => item._id !== product._id);
    setWishList(newWishList);
    localStorage.setItem('wishList', JSON.stringify(newWishList));
  };

  const addWishList = (product) => {
    if (!isInWishList(product)) {
      const newWishList = [...wishList, product];
      setWishList(newWishList);
      localStorage.setItem('wishList', JSON.stringify(newWishList));
    }
  };

  const isInWishList = (product) => {
    return wishList.some((item) => item._id === product._id);
  };

  const fetchingProduct = useMutation({
    mutationFn: async () => {
      return await productService.getAllProducts({ q: 'min' });
    },
    onSuccess: (data) => {
      toast.info('Welcome to our shop!');

      setProducts(data);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        console.log('error.response.data', error.response?.data);
        console.log('error.response.status', error.response?.status);

        toast.error(`Error ${error.response?.status}`, {
          description: `${error.response?.data?.message}`,
        });
      }
    },
  });

  useEffect(() => {
    fetchingProduct.mutate();
  }, []);

  return (
    <Fragment>
      <div
        className={cx('breadcrumb')}
        style={{ background: `url(${images.breadcrumb}) 50% / cover no-repeat`, backgroundAttachment: 'fixed' }}
      >
        <div className={cx('content')}>
          <h2 className={cx('text')}>Our Shop</h2>
          <span className={cx('context')}>
            <p className={cx('start')}>Home</p>
            <FontAwesomeIcon icon={faAngleRight} className={cx('breadcrumb-icon')} />
            <p className={cx('current')}>Shop</p>
          </span>
        </div>
      </div>
      <div className="grid wide">
        <div className="row">
          <div className="col l-3">
            <div className={cx('sidebar-component')}>
              <Sidebar />
            </div>
          </div>
          <div className="col l-9">
            <div className={cx('shop-header')}>
              <div className="flex justify-between align-center mb-10px mt-12px">
                <div className={cx('tabs')}>
                  <div className={cx('tab-item')}>
                    <Text>Categories</Text>
                  </div>
                  <div className={cx('tab-item')}>
                    <Link to={'/login'}>
                      <Text>Suggestions</Text>
                    </Link>
                  </div>
                  <div className={cx('tab-item')}>
                    <Text>Sale Products</Text>
                  </div>
                </div>
                <div className={cx('sorting')}>
                  <p className={cx('counter-product')}>Showing 1 - 12 of 35</p>
                  <div className={cx('sorting-content', 'flex align-center')}>
                    <p className={cx('sorting-text')}>
                      <Text>
                        Default sorting
                        <i className={cx('sort-icon')}>
                          <FontAwesomeIcon icon={faChevronDown} />
                        </i>
                      </Text>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              {products.map((product, index) => {
                return (
                  <div className="col l-4">
                    <div className={cx('product-component')}>
                      <Product
                        product={product}
                        addWishList={addWishList}
                        deleteWishList={deleteWishList}
                        isInWishList={isInWishList}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default Shop;
