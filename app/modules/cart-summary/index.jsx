import React, { FunctionComponent, useEffect } from 'react';
import {
  SummaryLayout,
  Row,
  Column,
  Body1,
  H2,
  H1,
  Expander,
  LayoutBgColor,
  useCalculateTotals,
  setTotalForKey,
  ButtonColor,
  PrimaryButton,
  FlexContent,
} from 'components';

import styled from 'styled-components';

const HeaderFont = styled(H1)`
  padding: 0px 8px;
`;

const CellFont = styled(H2)`
  padding: 8px 20px;
`;

const TotalsFont = styled(Body1)`
  padding: 4px 8px;
`;

const ListWrapper = props => {
  return (
    <Column
      width="90%"
      childSpacing={8}
      padding={16}
      bgColor={LayoutBgColor.GREY}
      scrollY
      useBorderRadius
    >
      {props.children.map(Child => {
        return (
          <Row
            key={Child.key}
            width="100%"
            bgColor={LayoutBgColor.WHITE}
            useBorderRadius
          >
            {Child}
          </Row>
        );
      })}
    </Column>
  );
};

const calcShipping = totalCost => {
  if (totalCost > 50) {
    return 0;
  }
  return 15;
};

export const CartSummary = props => {
  const calcTotalsFor = {
    subTotal: product => product.price * product.quantity,
    taxes: 0,
    shipping: 0,
    totalCost: 0,
  };

  const { totals, dispatch } = useCalculateTotals(
    props.cart.products,
    calcTotalsFor,
  );

  useEffect(() => {
    /**
     * Calculate Taxes
     */
    const subTotal = Number(totals.subTotal);
    const taxes = subTotal * 0.1;
    const shipping = calcShipping(subTotal);
    const totalCost = subTotal + taxes + shipping;

    dispatch(setTotalForKey('taxes', taxes));
    dispatch(setTotalForKey('shipping', shipping));
    dispatch(setTotalForKey('totalCost', totalCost));
  }, [totals.subTotal, dispatch]);

  return (
    <SummaryLayout title="Cart Summary">
      {{
        Left: (
          <>
            <Row width="90%" padding={16}>
              <HeaderFont>Products</HeaderFont>
              <Expander />
              <HeaderFont>Price</HeaderFont>
              <HeaderFont>Qty</HeaderFont>
            </Row>
            <ListWrapper>
              {props.cart.products.map(product => {
                return (
                  <React.Fragment key={product.name}>
                    <CellFont>{product.name}</CellFont>
                    <Expander />
                    <CellFont>${product.price}</CellFont>
                    <CellFont>{product.quantity}</CellFont>
                  </React.Fragment>
                );
              })}
            </ListWrapper>
          </>
        ),
        Right: (
          <>
            <ListWrapper>
              {[
                { name: 'Subtotal', value: totals.subTotal.toFixed(2) },
                { name: 'Taxes', value: totals.taxes.toFixed(2) },
                { name: 'Shipping', value: totals.shipping.toFixed(2) },
                { name: 'Total Cost', value: totals.totalCost.toFixed(2) },
              ].map(total => (
                <React.Fragment key={total.name}>
                  <TotalsFont>{total.name}</TotalsFont>
                  <Expander />
                  <TotalsFont>${total.value}</TotalsFont>
                </React.Fragment>
              ))}
            </ListWrapper>
            <Expander />
            <Row
              width="100%"
              justifyContent={FlexContent.CENTER}
              padding={{ top: 32, right: 0 }}
            >
              <PrimaryButton
                color={ButtonColor.BLUE}
                onClick={() => alert('Cart Submitted!')}
              >
                Submit Cart
              </PrimaryButton>
            </Row>
          </>
        ),
      }}
    </SummaryLayout>
  );
};
